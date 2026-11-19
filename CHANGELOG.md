# Changelog

## Unreleased

- Added a lockfile for reproducible installs and aligned jsdom with the development runtime.
- Fixed the preview server to serve assets with appropriate MIME types and reject path traversal.
- Added four gallery visual baselines and corrected light-theme contrast. Full-page captures wait for every gallery image to load.
- Verified packaged components with React 18.3.1 in addition to the React 19 development runtime.
- Prepared public documentation, a portable migration audit and continuous integration.

## 0.2.0 — 2026-11-19

- **Breaking:** root exports use Soft Depth dimensional SVGs; monochrome icons moved to `/line`.
- Added 157 dimensional SVG designs and 170 named exports with instance-specific gradient IDs.
- Added custom surfaces for Wallet, ShoppingCart and Headphones, plus 154 layered vector extrusions.
- Added 471 transparent PNG exports and three independent studio images.
- Added optional image components and asset subpaths.
- Added a searchable gallery with category filters, theme switching, downloads and copy examples.
- Added SVG, accessibility, raster-bounds, registry, gallery and tree-shaking checks.
- Added three experimental depth components under `/depth`.

## 0.1.0 — 2026-11-19

- Initial Signature Cut family with 157 SVG designs and 13 compatibility aliases.
- React components, TypeScript declarations, inherited color and accessible titles.
- Optional dynamic registry, tree-shaking checks and a searchable gallery.
- Migration audit for static imports and configured icon names.
