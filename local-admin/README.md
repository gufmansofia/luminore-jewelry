# Luminore Admin — localhost prototype

The selected photo catalogue runs separately from the public website. It is not a production authentication system.

## Start

Use Bun 1.3.9. Set the owner address in the ignored `.env.local` file:

```env
LOCAL_ADMIN_OWNER_EMAIL=your-email@example.com
```

```sh
bun run dev:admin
```

Open **http://localhost:3048/admin**. Enter the configured owner email. In **Приглашения**, add a colleague's email and choose Editor or Publisher. Sign out, then enter that invited email to try their access. Unknown and revoked emails are rejected.

This localhost-only prototype deliberately follows the owner's email-only entry request: it does **not** verify email ownership, use Google, send invitation emails, or grant access to production. A colleague must be told the link manually; localhost points to the current computer. A deployed version must verify email ownership and use proper production authentication before any production data is connected.

## Catalogue behavior

- All 108 products are copied once from the current curated catalogue, retaining their IDs, SKUs, prices, exact weights, multilingual copy, photos and collections.
- New products receive a temporary draft identifier (shown as **Черновик №…**, stored internally as `D…`). A permanent `P…` SKU is assigned atomically only on the first successful publication, in publication order. Failed publication and draft deletion do not consume permanent SKUs. Existing published SKUs never change, including when restoring history written before publication. Reservations persist across restarts. Drafts can have incomplete pricing or photography; local publication requires a name, positive price and a photograph.
- Legacy unpublished drafts, including recoverable deleted drafts, migrate to temporary identifiers. Names, prices, photographs, invitations and history are retained. Their version changes so already-open old forms cannot overwrite the migrated metadata.
- Edits autosave into the local draft after a short pause. The editor shows pending, saving, saved or failed status. Empty new forms create nothing; a name or successful photo upload starts a draft. Initial creation is idempotent, saves are serialized, and stale versions pause writes rather than overwrite another editor. **Сохранить и закрыть** waits for saving, then opens **Черновики** with filters cleared and the saved item first. Failed saves keep the editor open.
- Existing edits are saved as drafts, separate from the published snapshot. Owners and Publishers may publish into the **local copy only**. Editors cannot publish or manage invitations.
- A saved, unpublished draft can be deleted after confirmation and restored from **Черновики → Корзина** with the same SKU, photos and history. Deletion is recoverable; SKUs of deleted drafts are not reused. All invited editors can manage shared drafts.
- For an existing published piece, **Отменить черновые изменения** discards only its draft edits. The published copy is retained. Saved discarded edits remain recoverable through the owner's revision history. Unsaved form inputs can also be cancelled after confirmation.
- Photo count has no per-product limit. Batch uploads run one file at a time with progress and per-file retry/removal. Uploaded File objects are released from the queue. JPEG, PNG, WebP and HEIC/HEIF photos are accepted, up to 15 MB each. HEIC is converted on the Mac with its built-in `sips` tool; videos are rejected. Photo controls support main-image selection, mouse drag-and-drop, touch hold-and-drag, accessible previous/next buttons, and undoing removal. The full gallery remains visible. Original site files are never deleted or overwritten.
- The editor exposes only the essential fields initially. Category-specific details, translations, certificates and history open on demand. Existing hidden data is retained when switching category. New drafts default to lab-grown diamond and 18 karat white gold; existing pieces, including the natural-diamond ring, are retained.
- Incomplete drafts show what is missing; a positive price, English name and at least one photo are required for local publication. Completed drafts are marked ready. Invitations are in the owner’s account menu; Catalogue and Drafts remain in the main navigation.
- Changes, history, sessions and invitations persist in `.local-admin/catalogue.sqlite`. New photos are stored in `.local-admin/uploads/`. Both are ignored by Git and sit outside `public/`.
- Optimistic version checks prevent silently overwriting another person's newer changes. Owners can restore a preceding saved version as a draft.
- Revoking access terminates that member's sessions. The owner's access cannot be removed from the interface.

## Isolation

The server binds to `127.0.0.1` only and refuses production/Vercel execution. Mutating API requests reject cross-site origins. Sessions use random tokens stored hashed in SQLite and HttpOnly, SameSite=Strict cookies. The email-only prototype is still intentionally unsuitable for deployment.

`local-admin/` is outside the public build's `src/` entrypoint scan. The regular website build, product source, sitemap and Google Sheet are not modified by local edits. No deployment or Git push is needed to run the prototype.

```sh
bun run test:admin
```

The suite checks invitation restrictions, server-side roles, revocation, source isolation, exact weights, concurrent edits, automatic SKU allocation, draft publication, restoration, upload handling, galleries over 16 photos, photo-only drafts, idempotent and serialized autosaves, HEIC conversion, and persistence. The native HEIC encoding test needs access to macOS image services.
