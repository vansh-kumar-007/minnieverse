# Minnieverse 🌿

A small, mobile-first birthday experience for Muskan (“Minnie”), designed with the **Heritage & Forest** palette.

## Visual direction

- Paper: `#E9E2D0`
- Forest: `#354C3C`
- Sage: `#879078`
- Rust: `#754B39`
- Ink: `#292D28`

The site is intentionally static: plain HTML, CSS, and JavaScript. No database, sign-in, analytics, or paid service is required.

## Local preview

Open `index.html` in a browser, or run a tiny local server from the repository folder:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Personalize the site

- **Photos:** replace the three files in `assets/` while keeping their filenames, or update the image paths in `index.html`.
  - `minnie-selfie.jpg` — hero portrait
  - `minnie-festive.webp` — scrapbook photo
  - `minnie-portrait.webp` — second scrapbook photo
- **Captions:** edit the text under the photo cards in `index.html`.
- **Birthday letter and card copy:** edit the closing section in `index.html`.
- **“Open when…” letters and ragebait responses:** edit `letterCopy` and `rageLines` in `script.js`.
- **Music:** update the four YouTube search URLs in `index.html`. Nothing autoplays.
- **Colors, typography, animations, responsive layouts:** edit `styles.css`. Reduced-motion preferences are respected.

Only use photos you have permission to share. Remember GitHub Pages is public, so anyone with the URL can view its contents; don't add private or sensitive material.

## GitHub Pages

A workflow at `.github/workflows/pages.yml` publishes the root folder when commits are pushed to `main`. After the first workflow run succeeds, check **Settings → Pages** and make sure the source is set to **GitHub Actions** if GitHub hasn't configured it automatically.

Expected project URL: `https://vansh-kumar-007.github.io/minnieverse/`

Do not print the notebook QR code until the published page loads on a phone and the photo assets, internal links, letters, and gift interaction have been tested.
