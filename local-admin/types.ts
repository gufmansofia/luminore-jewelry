export type MemberRole = 'owner' | 'editor' | 'publisher';
export interface Member {
  email: string;
  role: MemberRole;
  status: 'invited' | 'active' | 'revoked';
  invitedAt: string;
  lastLoginAt: string | null;
}
export type Category = 'Rings' | 'Earrings' | 'Bracelets' | 'Pendants' | 'Necklaces';
export const categories: Record<Category, string> = {
  Rings: 'Кольца', Earrings: 'Серьги', Bracelets: 'Браслеты', Pendants: 'Подвески', Necklaces: 'Колье',
};
export const roleLabels: Record<MemberRole, string> = {
  owner: 'Владелец', editor: 'Редактор', publisher: 'Редактор с публикацией',
};
export type Locale = 'en' | 'ru' | 'uk';
export interface ProductData {
  id: number;
  sku: string;
  brand: 'Luminore' | 'Zoke';
  category: Category;
  names: Record<Locale, string>;
  descriptions: Record<Locale, string>;
  price: number | null;
  totalCarat: number | null;
  metal: string;
  stoneType: string;
  cut: string;
  colour: string;
  clarity: string;
  size: string;
  grossWeight: number | null;
  goldWeight: number | null;
  mainStoneCarat: number | null;
  paveCarat: number | null;
  certificate: string;
  certificateNumber: string;
  chainIncluded: boolean | null;
  kids: boolean;
  images: string[];
  altText: string;
}
export interface AdminProduct {
  data: ProductData;
  published: ProductData | null;
  hasChanges: boolean;
  version: number;
  updatedAt: string;
  updatedBy: string;
  position: number;
  deletedAt: string | null;
  deletedBy: string | null;
}
export interface DraftDeletion { kind: 'deleted' | 'discarded'; product: AdminProduct }
export interface Revision {
  id: number;
  productId: number;
  action: 'created' | 'saved' | 'published' | 'restored' | 'deleted' | 'undeleted' | 'discarded';
  actor: string;
  createdAt: string;
  restorable: boolean;
}
export interface SessionInfo { user: Member; localOnly: true }
export function productStatus(p: AdminProduct) {
  return !p.published || p.hasChanges ? (publicationMissing(p.data).length ? 'draft' : 'ready') : 'published';
}
export const statusLabels = { draft: 'Черновик', ready: 'Готово к публикации', published: 'Опубликовано локально' };
export function publicationMissing(p: ProductData): string[] {
  return [!p.names.en.trim() ? 'название' : '', !p.price ? 'цену' : '', !p.images.length ? 'фото' : ''].filter(Boolean);
}
export const productTitle = (p: ProductData) => p.names.en.trim() || 'Без названия';
export function emptyProduct(): ProductData {
  return {
    id: 0, sku: 'Авто', brand: 'Luminore', category: 'Rings', names: { en: '', ru: '', uk: '' }, descriptions: { en: '', ru: '', uk: '' },
    price: null, totalCarat: null, metal: '18 karat white gold', stoneType: 'Lab-Grown Diamond', cut: '', colour: '', clarity: '', size: '',
    grossWeight: null, goldWeight: null, mainStoneCarat: null, paveCarat: null, certificate: '', certificateNumber: '', chainIncluded: null,
    kids: false, images: [], altText: '',
  };
}
