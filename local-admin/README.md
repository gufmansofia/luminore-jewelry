# Luminore Studio — localhost prototype

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
- New products receive an automatic unique SKU. Drafts can have incomplete pricing or photography; local publication requires a positive price and a photograph.
- Existing edits are saved as drafts, separate from the published snapshot. Owners and Publishers may publish into the **local copy only**. Editors cannot publish or manage invitations.
- Photos can be uploaded, removed from a gallery, made primary or reordered. Uploads accept JPEG, PNG and WebP, up to 15 MB each. Original site files are never deleted or overwritten.
- Changes, history, sessions and invitations persist in `.local-admin/catalogue.sqlite`. New photos are stored in `.local-admin/uploads/`. Both are ignored by Git and sit outside `public/`.
- Optimistic version checks prevent silently overwriting another person's newer changes. Owners can restore a preceding saved version as a draft.
- Revoking access terminates that member's sessions. The owner's access cannot be removed from the interface.

## Isolation

The server binds to `127.0.0.1` only and refuses production/Vercel execution. Mutating API requests reject cross-site origins. Sessions use random tokens stored hashed in SQLite and HttpOnly, SameSite=Strict cookies. The email-only prototype is still intentionally unsuitable for deployment.

`local-admin/` is outside the public build's `src/` entrypoint scan. The regular website build, product source, sitemap and Google Sheet are not modified by local edits. No deployment or Git push is needed to run the prototype.

```sh
bun run test:admin
```

The suite checks invitation restrictions, server-side roles, revocation, source isolation, exact weights, concurrent edits, automatic SKU allocation, draft publication, restoration, upload handling and persistence.
