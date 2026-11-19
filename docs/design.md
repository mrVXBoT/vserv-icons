# Design

## Monochrome: Signature Cut

- 24 × 24 viewBox, 1.75-unit strokes, round caps and joins.
- Intended sizes: 16, 20, 24 and 32px.
- Contained forms use an asymmetric diagonal top-right cut; arrows, checks and status symbols retain simple silhouettes.
- Color comes from `currentColor` and the host theme.
- SVG sources live in `svg/`. Aliases share canonical geometry.
- Directional icons have explicit geometry. Applications choose the appropriate arrow for RTL and LTR.

## Dimensional: Soft Depth

The primary family uses graphite body gradients, cyan rims and royal-blue extrusion. Material colors are listed in `dimensional/materials.json`. Geometry is static and requires no WebGL runtime.

Wallet, ShoppingCart and Headphones use custom solid surfaces. The remaining 154 designs use layered extrusion of the monochrome geometry. Dimensional sources live in `dimensional/svg/`; build scripts generate React components from them.

## Studio images

Three independent transparent PNG illustrations live in `dimensional/renders/`. They are separate from the SVG family and are exposed through the `/renders` entry point. Raster exports in `dimensional/png/` are rendered from SVGs instead.

## Visual regression

The gallery provides dark and light themes. Four browser baselines cover both themes and both writing directions. Run `npm run test:visual` with the same browser, OS and fonts as the baselines. Review intentional changes before updating them with `UPDATE_VISUAL=1 npm run test:visual`.
