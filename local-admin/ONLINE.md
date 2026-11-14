# Online admin rollout

The separate online admin is published at https://luminore-jewelry-admin.sgufman06.chatgpt.site/admin. It uses trusted Sites ChatGPT identity, an invited-email allowlist, D1 records and R2 uploads. The loopback-only Bun prototype remains separate and must never be exposed to the internet.

The website can consume only approved snapshots during its build by setting `ADMIN_CATALOGUE_URL=https://luminore-jewelry-admin.sgufman06.chatgpt.site/catalogue.json`. Leave the setting unset until catalogue migration, the Google Sheets bridge and a production deploy hook have been verified. Without it, the existing curated stock stays unchanged.

`build.ts` refreshes the snapshot before loading SEO modules or bundling the client. `mergeAdminProducts` preserves existing product IDs and SKUs, updates translated website fields and adds new published products. Failed downloads, empty catalogues or conflicting identity stop the new build, retaining the previous deployment. The build emits `.well-known/luminore-catalogue.json` so the admin can verify the actual published release instead of claiming completion merely after triggering a hook.

The Google stock spreadsheet is `1QSFCK1olOhxoxPO004xyABNHbVxB2xD8P_FexZikEJ4`, tab `Stock`, headers on row 6, data from row 7, columns A:O. Descriptions and translations are mirrored separately to `Website text!A:F` using the same permanent SKU. The Apps Script bridge extends the existing native tables so new rows remain inside their filters and dropdown columns. Drafts must never be sent there. A copied workbook must be used for the end-to-end test. Native tools in a chat do not constitute permanent credentials for the hosted application.

Current rollout limits: owner sign-in, migration to the hosted database, permanent Google Sheets authorization and the complete live publication flow still require verification/configuration. The authorized Vercel main-branch hook has been created and stored as a Sites runtime secret; it has not been triggered. Publication is blocked in the online API until the external connections exist. The website integration in this commit is prepared but not activated on the official domain.

Publication additionally requires `PUBLICATION_ENABLED=true` after verification. It remains unset during rollout. An interrupted catalogue import can resume from the same transfer file after reloading; existing team edits are preserved. Publication delivery uses a bounded lease to prevent overlapping retries and resumes without duplicating the permanent SKU or a synchronized sheet row.

A separate test workbook and Apps Script project have been staged. The Google deployment is waiting for its authorization dialog; no script writes have been made to the working spreadsheet.

Google Sheets API v4 has been staged in the Apps Script service picker. Its displayed API terms and the Google authorization must still be confirmed by the owner before the live test. All independent code checks pass; no end-to-end live delivery is claimed before that test.
