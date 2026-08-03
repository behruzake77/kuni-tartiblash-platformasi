# UI component sources

Ordo does **not** scrape visual CSS from Linear/Stripe/Apple product sites.

We combine **open component systems** + **community snippets** (with attribution), then theme with Ordo tokens.

| Piece | Upstream | License / terms | Notes |
|---|---|---|---|
| **Button base** | [shadcn/ui Button](https://ui.shadcn.com/docs/components/button) + [Radix Slot](https://www.radix-ui.com/primitives/docs/utilities/slot) | MIT | `asChild`, CVA variants, a11y focus |
| **Button motion variants** | [Uiverse.io](https://uiverse.io/) via [uiverse-io/galaxy](https://github.com/uiverse-io/galaxy) | Community (credit authors) | See below |
| Icons | [Lucide](https://lucide.dev/) | ISC | `lucide-react` |
| CVA / cn() | cva · clsx · tailwind-merge | Apache/MIT | shadcn stack |

## Uiverse.io button adaptations

CSS lives in `src/styles/uiverse-buttons.css`. React wiring in `button.tsx`.

| Variant | Original (galaxy) | Author | Ordo use |
|---|---|---|---|
| `cta` | `Buttons/satyamchaudharydev_modern-sheep-10.html` | satyamchaudharydev | Marketing / primary “Get started” with arrow |
| `shine` | `Buttons/Itskrish01_soft-skunk-68.html` | Itskrish01 | Emphasized actions, slide fill |
| `lift` | `Buttons/Codecite_modern-pig-84.html` | Codecite | Soft gradient pill CTA |

**Changes from originals:** Ordo brand gradient / primary tokens, radius scale, type (Inter), reduced-motion, no fixed width, works inside our `Button` sizes.

## Usage

```tsx
<Button variant="cta" size="lg">Get started</Button>
<Button variant="shine">Sync now</Button>
<Button variant="lift" size="lg">Go Pro</Button>
```

Showcase: `/ui` (dev gallery) and `preview/buttons.html`.

## Why not “download buttons from design sites”?

Sites like Linear/Stripe are **inspiration**, not copy-paste assets (copyright + won’t match our tokens).

Correct approach (what we do):

1. Take **headless / code-owned** primitives (Radix, shadcn).  
2. Restyle with **Ordo design tokens**.  
3. Keep product-specific variants (e.g. brand gradient CTA).

## Adding more shadcn components later

```bash
npx shadcn@latest add dialog dropdown-menu tooltip
```

Then re-map CSS variables to `src/styles/tokens.css`.
