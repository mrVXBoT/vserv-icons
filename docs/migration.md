# Migration guide

## From Lucide

Use the [export name mapping](migration-matrix.md) to check supported names. Similar names do not guarantee identical geometry or behavior.

```tsx
// Before
import { ShoppingCart, UserRound } from 'lucide-react';

// After: dimensional icons
import { ShoppingCart, UserRound } from '@vserv/icons';

// For compact controls or CSS-controlled colors
import { ShoppingCart as ShoppingCartLine } from '@vserv/icons/line';
```

Local aliases such as `Link as LinkIcon` remain valid. Replace Lucide-specific component types with a React component type compatible with `IconProps`. Stroke width is fixed and is not a supported customization prop.

## Dynamic names

Run `npm run audit -- /path/to/application/src` to inspect static imports and configured names. Reports are local to `tests/results/audit/`. The audit cannot discover every name stored in an API or database; compare those values separately with `icons.json`.

The optional `/registry` entry point resolves unknown names to `Sparkles` and imports all dimensional icons. Use static named imports when possible.

Aliases in `icons.json` share geometry: for example, `AlertCircle` and `CircleAlert` resolve to the same component. Review application-specific mappings before replacing a resolver.

## Styling and accessibility

- Replace selectors that depend on Lucide-generated CSS classes with application-owned classes.
- Review `fill`, stroke and color styles. Monochrome icons use `currentColor`; dimensional icons have fixed colors.
- Keep monochrome icons for small controls unless the dimensional silhouette remains clear at the intended size.
- Name icon-only buttons on the button itself. Use `title`, `aria-label` or `aria-labelledby` for standalone icons.
- Check alignment, hover, focus, disabled and loading states in both themes and writing directions. Directional icons do not mirror automatically.
- Product logos, flags and unrelated illustrations need their own migration decisions.

Remove the previous dependency only after checking imports, re-exports, runtime names and active application routes. Compare the application bundle before and after the migration.

## From 0.1 to 0.2

Root exports now use dimensional SVGs. Monochrome exports moved to `@vserv/icons/line`, including direct paths such as `@vserv/icons/line/icons/Wallet`. The same 170 export names are available in both families.

`WalletRender`, `ShoppingCartRender` and `HeadphonesRender` from `/renders` are PNG image components with `alt` props. They are independent of SVG registry names. Version 0.2 includes three studio images, 157 dimensional SVGs and matching raster exports at three sizes.
