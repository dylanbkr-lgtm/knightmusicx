# Knight Musix X — Static Site Starter

This is a lightweight, zero-build static site ready for **Netlify**. No frameworks required.

## Quick Deploy (Netlify + GitHub)
1. Create a new GitHub repo (e.g. `knightmusicx-site`) and push these files.
2. In Netlify, **Add new site** → **Import from Git** → pick the repo.
3. Build settings: No build command. **Publish directory:** `.` (root).
4. In Netlify → **Site settings** → **Domain management**, add your custom domain: `knightmusicx.com` and follow DNS instructions.
5. (Optional) Set `contact@knightmusicx.com` as the form notification email under **Forms**.

## Customize
- Replace the Spotify embed URLs in `index.html` and `artists/lil-cabbage.html`.
- Add artist pages under `/artists/` and link them from the **Artists** grid.
- Drop your images in `/images` and update `og-image.png`.
- Update social links in the **Contact** section.
- Edit meta tags in `<head>` for SEO and sharing.

## Netlify Forms
The contact form uses Netlify Forms (no backend needed). Submissions will appear in your Netlify dashboard.

## Redirects
Use `_redirects` or `netlify.toml` to create short links, e.g. `/victoria` → `/artists/victoria.html`.

## Local Preview
Just open `index.html` in a browser. No tooling required.
