# Nike sneaker storefront

React + Vite interactive concept storefront, featuring the supplied red-and-black high-top shoe cutout, animated hero background, product details and a demo shopping bag. Orders and payments are not enabled.

## Deploy on Vercel

Import this GitHub repository. Keep **Root Directory** at the repository root (leave it blank). `vercel.json` configures everything else:

- Framework: Vite
- Install command: `npm ci`
- Build command: `npm run build:vercel`
- Output directory: `dist/client`
- No environment variables required.

## Structure

```text
src/             React components and CSS
public/assets/   Shoe images and retained model assets
index.html       App entry document
package.json     Dependencies and commands
package-lock.json Reproducible dependency versions
vite.config.mjs  Vite configuration
vercel.json      Vercel deployment configuration
scripts/         Optional Sites build helpers
worker/          Optional Sites worker (not used on Vercel)
tests/           Sites worker checks
```

## Local development

Run `npm ci`, then `npm run dev`. For a production preview run `npm run build:vercel` then `npm run preview`.

The current hero uses `public/assets/jordan-shoe.png` and CSS perspective motion. It is a 2D cutout, not a 3D model. Older model assets and `ShoeViewer.jsx` are retained but unused.

`npm run build` also prepares optional Sites hosting output. Vercel uses only the static frontend through `build:vercel`.

This is an independent concept, not an official Nike store. Product copy and price are demonstration content.
