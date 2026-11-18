# Price List (salesman app)

Static installable web app (PWA). Source files are in `app/`.
Icons are stored as base64 text (`app/*.png.b64`); the workflow in
`.github/workflows/pages.yml` decodes them and publishes the site to the
`gh-pages` branch, which GitHub Pages serves.

To update: replace `app/index.html` (and bump the cache name in `app/sw.js`),
commit to `main`, and the workflow republishes automatically.
