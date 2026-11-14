import { Database } from 'bun:sqlite';
import { createHash, randomBytes } from 'node:crypto';
import { products as websiteProducts } from '../src/data/products';
import type { Product } from '../src/data/products';
import { productDescription, productName } from '../src/lib/product-copy';
import { isKidsCollectionProduct } from '../src/data/kids-collection';
import { categories, publicationMissing, type AdminProduct, type DraftDeletion, type Member, type ProductData, type Revision } from './types';

export class AdminError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export function normalizeEmail(value: unknown) {
  const email = typeof value === 'string' ? value.trim().toLowerCase() : '';
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new AdminError(400, 'Введите корректный email.');
  return email;
}
const digest = (token: string) => createHash('sha256').update(token).digest('hex');
const now = () => new Date().toISOString();
const text = (v: unknown, max = 500) => typeof v === 'string' ? v.trim().slice(0, max) : '';
function numberOrNull(value: unknown, label: string, max = 1_000_000) {
  if (value === '' || value === null || value === undefined) return null;
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > max) throw new AdminError(400, `Проверьте поле «${label}».`);
  return value;
}
export function seedProduct(p: Product): ProductData {
  return {
    id: p.id, sku: p.sku, brand: p.sourceBrand === 'Luminore' ? 'Luminore' : 'Zoke', category: p.categoryEn as ProductData['category'],
    names: { en: productName(p, 'en'), ru: productName(p, 'ru'), uk: productName(p, 'uk') },
    descriptions: { en: productDescription(p, 'en', false, false), ru: productDescription(p, 'ru', false, false), uk: productDescription(p, 'uk', false, false) },
    price: p.priceUsd, totalCarat: p.totalCarat, metal: p.metalType, stoneType: p.gemstoneType,
    cut: p.diamondCut, colour: p.diamondColor, clarity: p.diamondClarity, size: p.size ?? '',
    grossWeight: p.grossWeight ?? null, goldWeight: p.goldWeight, mainStoneCarat: p.mainStoneCarat, paveCarat: p.paveCarat ?? null,
    certificate: p.certificateType, certificateNumber: p.certificateNumber ?? '', chainIncluded: p.chainIncluded ?? null,
    kids: isKidsCollectionProduct(p), images: [...p.images], altText: p.altText || productName(p, 'en'),
  };
}
function validateProduct(input: unknown, id: number, sku: string): ProductData {
  if (!input || typeof input !== 'object') throw new AdminError(400, 'Не удалось прочитать карточку.');
  const p = input as Record<string, any>;
  if (!['Luminore', 'Zoke'].includes(p.brand)) throw new AdminError(400, 'Выберите бренд.');
  if (!Object.hasOwn(categories, p.category)) throw new AdminError(400, 'Выберите категорию.');
  const names = { en: text(p.names?.en, 180), ru: text(p.names?.ru, 180), uk: text(p.names?.uk, 180) };
  const images = Array.isArray(p.images) ? p.images : [];
  if (images.some((src: unknown) => typeof src !== 'string' || !/^\/(?:Products\/|optimized\/|admin-uploads\/[a-f0-9-]+\.(?:jpg|png|webp)$)/.test(src) || src.includes('..') || src.includes('\\'))) {
    throw new AdminError(400, 'Добавьте фотографии через кнопку загрузки.');
  }
  return {
    id, sku, brand: p.brand, category: p.category, names,
    descriptions: { en: text(p.descriptions?.en, 10000), ru: text(p.descriptions?.ru, 10000), uk: text(p.descriptions?.uk, 10000) },
    price: numberOrNull(p.price, 'Цена'), totalCarat: numberOrNull(p.totalCarat, 'Общий вес камней', 10000),
    metal: text(p.metal), stoneType: text(p.stoneType), cut: text(p.cut), colour: text(p.colour), clarity: text(p.clarity), size: text(p.size),
    grossWeight: numberOrNull(p.grossWeight, 'Вес изделия'), goldWeight: numberOrNull(p.goldWeight, 'Вес золота'),
    mainStoneCarat: numberOrNull(p.mainStoneCarat, 'Основной камень', 10000), paveCarat: numberOrNull(p.paveCarat, 'Камни паве', 10000),
    certificate: text(p.certificate), certificateNumber: text(p.certificateNumber), chainIncluded: typeof p.chainIncluded === 'boolean' ? p.chainIncluded : null,
    kids: p.kids === true, images: [...new Set(images)] as string[], altText: text(p.altText) || names.en,
  };
}
type ProductRow = { id: number; sku: string; data: string; published: string | null; hasChanges: number; version: number; updatedAt: string; updatedBy: string; position: number; deletedAt: string | null; deletedBy: string | null };
function decode(row: ProductRow): AdminProduct {
  return { data: JSON.parse(row.data), published: row.published ? JSON.parse(row.published) : null, hasChanges: !!row.hasChanges,
    version: row.version, updatedAt: row.updatedAt, updatedBy: row.updatedBy, position: row.position, deletedAt: row.deletedAt, deletedBy: row.deletedBy };
}
export class AdminStore {
  db: Database;
  constructor(file: string, ownerEmail: string, seeds: ProductData[] = websiteProducts.map(seedProduct)) {
    this.db = new Database(file, { create: true });
    this.db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
      CREATE TABLE IF NOT EXISTS members(email TEXT PRIMARY KEY, role TEXT NOT NULL, status TEXT NOT NULL, invitedAt TEXT NOT NULL, lastLoginAt TEXT);
      CREATE TABLE IF NOT EXISTS sessions(tokenHash TEXT PRIMARY KEY, email TEXT NOT NULL REFERENCES members(email), expiresAt INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS products(id INTEGER PRIMARY KEY, sku TEXT UNIQUE NOT NULL, data TEXT NOT NULL, published TEXT, hasChanges INTEGER NOT NULL DEFAULT 0, version INTEGER NOT NULL DEFAULT 1, updatedAt TEXT NOT NULL, updatedBy TEXT NOT NULL, position INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS revisions(id INTEGER PRIMARY KEY AUTOINCREMENT, productId INTEGER NOT NULL REFERENCES products(id), action TEXT NOT NULL, actor TEXT NOT NULL, createdAt TEXT NOT NULL, beforeData TEXT);
      CREATE TABLE IF NOT EXISTS draft_keys(key TEXT PRIMARY KEY, actor TEXT NOT NULL, productId INTEGER NOT NULL REFERENCES products(id));`);
    // Preserve existing local catalogues and invitations when upgrading the prototype.
    const columns = new Set((this.db.query('PRAGMA table_info(products)').all() as { name: string }[]).map(column => column.name));
    this.db.transaction(() => {
      if (!columns.has('deletedAt')) this.db.exec('ALTER TABLE products ADD COLUMN deletedAt TEXT');
      if (!columns.has('deletedBy')) this.db.exec('ALTER TABLE products ADD COLUMN deletedBy TEXT');
    })();
    const owner = normalizeEmail(ownerEmail);
    this.db.query(`INSERT OR IGNORE INTO members VALUES (?, 'owner', 'active', ?, NULL)`).run(owner, now());
    const count = this.db.query('SELECT count(*) AS n FROM products').get() as { n: number };
    if (!count.n) this.db.transaction(() => {
      const statement = this.db.query('INSERT INTO products(id,sku,data,published,hasChanges,version,updatedAt,updatedBy,position) VALUES (?, ?, ?, ?, 0, 1, ?, ?, ?)');
      seeds.forEach((p, position) => statement.run(p.id, p.sku, JSON.stringify(p), JSON.stringify(p), now(), owner, position));
    })();
  }
  close() { this.db.close(); }
  member(email: string) { return this.db.query('SELECT * FROM members WHERE email=?').get(email) as Member | null; }
  login(value: unknown) {
    const email = normalizeEmail(value), member = this.member(email);
    if (!member || member.status === 'revoked') throw new AdminError(403, 'Этот адрес не приглашён. Попросите владельца добавить вашу почту.');
    this.db.query("UPDATE members SET status='active', lastLoginAt=? WHERE email=?").run(now(), email);
    const token = randomBytes(32).toString('hex');
    this.db.query('DELETE FROM sessions WHERE expiresAt<?').run(Date.now());
    this.db.query('INSERT INTO sessions VALUES (?, ?, ?)').run(digest(token), email, Date.now() + 12 * 60 * 60 * 1000);
    return { token, user: this.member(email)! };
  }
  session(token?: string) {
    if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
    return this.db.query(`SELECT m.* FROM members m JOIN sessions s ON s.email=m.email WHERE s.tokenHash=? AND s.expiresAt>? AND m.status<>'revoked'`).get(digest(token), Date.now()) as Member | null;
  }
  logout(token?: string) { if (token) this.db.query('DELETE FROM sessions WHERE tokenHash=?').run(digest(token)); }
  owner(actor: Member) { if (actor.role !== 'owner') throw new AdminError(403, 'Управлять приглашениями может только владелец.'); }
  members(actor: Member) { this.owner(actor); return this.db.query('SELECT * FROM members ORDER BY role=\'owner\' DESC, invitedAt DESC').all() as Member[]; }
  invite(actor: Member, value: unknown, role: unknown) {
    this.owner(actor);
    const email = normalizeEmail(value);
    if (!['editor', 'publisher'].includes(String(role))) throw new AdminError(400, 'Выберите права сотрудника.');
    if (this.member(email)?.role === 'owner') throw new AdminError(400, 'Доступ владельца уже настроен.');
    this.db.query(`INSERT INTO members VALUES (?, ?, 'invited', ?, NULL) ON CONFLICT(email) DO UPDATE SET role=excluded.role, status=CASE WHEN members.status='active' THEN 'active' ELSE 'invited' END`).run(email, String(role), now());
    return this.member(email)!;
  }
  revoke(actor: Member, value: unknown) {
    this.owner(actor);
    const email = normalizeEmail(value);
    if (this.member(email)?.role === 'owner') throw new AdminError(400, 'Нельзя отключить владельца из прототипа.');
    if (!this.member(email)) throw new AdminError(404, 'Приглашение не найдено.');
    this.db.transaction(() => { this.db.query("UPDATE members SET status='revoked' WHERE email=?").run(email); this.db.query('DELETE FROM sessions WHERE email=?').run(email); })();
  }
  list() { return (this.db.query('SELECT * FROM products WHERE deletedAt IS NULL ORDER BY position').all() as ProductRow[]).map(decode); }
  trash() { return (this.db.query('SELECT * FROM products WHERE deletedAt IS NOT NULL ORDER BY deletedAt DESC').all() as ProductRow[]).map(decode); }
  product(id: number, includeDeleted = false) {
    const row = this.db.query('SELECT * FROM products WHERE id=?').get(id) as ProductRow | null;
    if (!row || (row.deletedAt && !includeDeleted)) throw new AdminError(404, 'Украшение не найдено.');
    return decode(row);
  }
  version(p: AdminProduct, value: unknown) { if (p.version !== value) throw new AdminError(409, 'Карточку уже изменили. Откройте её заново, чтобы не потерять чужие правки.'); }
  record(id: number, action: Revision['action'], actor: Member, before: ProductData | null) {
    this.db.query('INSERT INTO revisions(productId, action, actor, createdAt, beforeData) VALUES (?, ?, ?, ?, ?)').run(id, action, actor.email, now(), before ? JSON.stringify(before) : null);
  }
  create(actor: Member, input: unknown, draftKey?: unknown) {
    return this.db.transaction(() => {
      if (draftKey !== undefined) {
        if (typeof draftKey !== 'string' || !/^[a-f0-9-]{36}$/.test(draftKey)) throw new AdminError(400, 'Откройте новую карточку и повторите сохранение.');
        const existing = this.db.query('SELECT productId FROM draft_keys WHERE key=? AND actor=?').get(draftKey, actor.email) as { productId:number } | null;
        if (existing) { const p=this.product(existing.productId); if(p.version!==1) throw new AdminError(409,'Карточка уже сохранена. Откройте её в черновиках.'); return p; }
      }
      const { n } = this.db.query('SELECT coalesce(max(id),0)+1 AS n FROM products').get() as { n: number };
      const p = validateProduct(input, n, `P${String(n).padStart(3, '0')}`);
      if (!p.names.en && !p.images.length) throw new AdminError(400, 'Добавьте название или фотографию, чтобы создать черновик.');
      this.db.query('INSERT INTO products(id,sku,data,published,hasChanges,version,updatedAt,updatedBy,position) VALUES (?, ?, ?, NULL, 1, 1, ?, ?, -1)').run(p.id, p.sku, JSON.stringify(p), now(), actor.email);
      if (draftKey) this.db.query('INSERT INTO draft_keys VALUES (?, ?, ?)').run(String(draftKey),actor.email,p.id);
      this.record(p.id, 'created', actor, null);
      return this.product(p.id);
    })();
  }
  save(actor: Member, id: number, input: unknown, version: unknown) {
    return this.db.transaction(() => {
      const before = this.product(id); this.version(before, version);
      const p = validateProduct(input, before.data.id, before.data.sku);
      this.db.query('UPDATE products SET data=?, hasChanges=?, version=version+1, updatedAt=?, updatedBy=? WHERE id=?').run(JSON.stringify(p), JSON.stringify(p) !== JSON.stringify(before.published) ? 1 : 0, now(), actor.email, id);
      this.record(id, 'saved', actor, before.data);
      return this.product(id);
    })();
  }
  publish(actor: Member, id: number, version: unknown) {
    if (actor.role === 'editor') throw new AdminError(403, 'У вас нет прав публикации. Черновик может опубликовать владелец.');
    return this.db.transaction(() => {
      const p = this.product(id); this.version(p, version);
      const missing=publicationMissing(p.data);
      if (missing.length) throw new AdminError(400, `Для публикации добавьте ${missing.join(', ')}.`);
      this.db.query('UPDATE products SET published=data, hasChanges=0, version=version+1, updatedAt=?, updatedBy=? WHERE id=?').run(now(), actor.email, id);
      this.record(id, 'published', actor, p.data);
      return this.product(id);
    })();
  }
  deleteDraft(actor: Member, id: number, version: unknown): DraftDeletion {
    return this.db.transaction((): DraftDeletion => {
      const p = this.product(id); this.version(p, version);
      if (p.published) {
        if (!p.hasChanges) throw new AdminError(400, 'У опубликованной карточки нет черновых изменений. Удалить её этой кнопкой нельзя.');
        this.db.query('UPDATE products SET data=published, hasChanges=0, version=version+1, updatedAt=?, updatedBy=? WHERE id=?').run(now(), actor.email, id);
        this.record(id, 'discarded', actor, p.data);
        return { kind: 'discarded', product: this.product(id) };
      }
      this.db.query('UPDATE products SET deletedAt=?, deletedBy=?, version=version+1, updatedAt=?, updatedBy=? WHERE id=?').run(now(), actor.email, now(), actor.email, id);
      this.record(id, 'deleted', actor, p.data);
      return { kind: 'deleted', product: this.product(id, true) };
    })();
  }
  restoreDraft(actor: Member, id: number, version: unknown) {
    return this.db.transaction(() => {
      const p = this.product(id, true); this.version(p, version);
      if (!p.deletedAt || p.published) throw new AdminError(400, 'Этот черновик не находится в корзине.');
      this.db.query('UPDATE products SET deletedAt=NULL, deletedBy=NULL, version=version+1, updatedAt=?, updatedBy=? WHERE id=?').run(now(), actor.email, id);
      this.record(id, 'undeleted', actor, null);
      return this.product(id);
    })();
  }
  history(id: number) {
    this.product(id);
    return this.db.query('SELECT id, productId, action, actor, createdAt, beforeData IS NOT NULL AS restorable FROM revisions WHERE productId=? ORDER BY id DESC LIMIT 20').all(id) as Revision[];
  }
  restore(actor: Member, id: number, revision: number, version: unknown) {
    this.owner(actor);
    const row = this.db.query('SELECT beforeData FROM revisions WHERE productId=? AND id=?').get(id, revision) as { beforeData: string | null } | null;
    if (!row?.beforeData) throw new AdminError(404, 'Версия не найдена.');
    return this.db.transaction(() => {
      const p = this.product(id); this.version(p, version);
      this.db.query('UPDATE products SET data=?, hasChanges=1, version=version+1, updatedAt=?, updatedBy=? WHERE id=?').run(row.beforeData, now(), actor.email, id);
      this.record(id, 'restored', actor, p.data);
      return this.product(id);
    })();
  }
}
