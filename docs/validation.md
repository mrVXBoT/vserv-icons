# Validation · Soft Depth 0.2.0 · 2026-11-19

Completed:

- TypeScript ESM build/declarations: 170 dimensional exports, 170 monochrome exports, three optional PNG-render components.
- 157 dimensional SVGs exported as transparent PNG at 64/256/512 (471 PNGs).
- librsvg rendered all 157 sources: nonempty alpha bounds and no content touching the 256-pixel canvas boundary. Hashes and bounds recorded in `dimensional/raster-validation.json`.
- SVG contract/security and export coverage checks; SVG paint references all resolve.
- SSR title/gradient IDs remain unique when multiple copies are rendered together; React mount/ref/update tests.
- Alias identities and dynamic-registry fallback checked.
- Tree-shaking verified for both families: line ShoppingCart 853 bytes; dimensional Wallet 2,789 bytes, minified, React external. Not full application sizes.
- Gallery JavaScript syntax and search/category/theme/copy behavior exercised with jsdom.
- Full-page browser captures explicitly load and decode every gallery image before comparing baselines.
- Three independent transparent studio PNGs included separately from the SVG raster exports.
- SVG contact sheets inspected in dark/light presentation. This is design review evidence, complemented by the browser-regression pass below.
- `package-lock.json` added; `npm ci` reinstalls cleanly with no engine warnings and all 12 unit tests pass on Node 22.22.1. jsdom pinned to `^27.4.0` so the dev toolchain agrees with the declared `engines.node >=20`.
- Browser pass: Playwright Chromium installed and `npm run test:visual` executed. Four full-page screenshots (dark/light × rtl/ltr) are committed as baselines in `tests/baselines/`; a second run matched them byte-for-byte. Axe (wcag2a, wcag2aa, wcag21aa) reported 0 violations after fixing light-theme contrast for `.eyebrow` and `.copyright`. Search and keyboard-focus assertions passed.
- Preview server (`npm run preview`) serves assets by path with correct MIME types and a path-traversal guard; gallery images and downloads resolve.
- React 18 matrix: the 0.2.0 tarball was installed into a separate consumer with `react`/`react-dom` 18.3.1. SSR and `createRoot` mount/ref/update checks passed for root, line, direct-icon, registry, depth and render subpaths. React 19 remained the development runtime.

Pending/limits:
- Only Wallet, ShoppingCart, Headphones have studio PNG renders. The complete set is dimensional SVG/vector-raster output; no 3D mesh files are supplied.
- Main SVG custom surface models: those same three; the remaining 154 glyphs use layered extrusion of source geometry.
- API/database name export and real-page integration still required before removing Lucide.
- No npm publication has occurred.

Package integration checks:

- Installed the actual 0.2.0 tarball into a separate temporary consumer using offline npm (no repository source import).
- Root, monochrome, direct-icon, registry and studio subpath imports rendered successfully through React SSR.
- Vite production build using only SVGs completed without emitting studio PNGs.
- A separate Vite production build using WalletRender resolved and emitted the wallet PNG asset correctly.
