# Website delivery

The user requested a permanent Vercel link that receives subsequent approved website updates.

- Production URL: https://luminore-jewelry.vercel.app
- GitHub: `gufmansofia/luminore-jewelry`; production branch: `main`.
- Use Bun and preserve the committed lockfile.
- After implementing approved website changes, run relevant checks and the production build, commit the changes, and push them to `origin/main` unless the user requests a preview or local-only work.
- Verify the corresponding Vercel deployment and the permanent URL before saying the changes are live. Never force-push production or overwrite unrelated remote changes.
- Keep local audit output, source documents, credentials and working video files out of commits. `public/` contains deployable assets.
