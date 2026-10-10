# Retain design

The UI is modelled on the [Untitled UI](https://www.untitledui.com/) design system, rebuilt on shadcn/ui components (Radix) with Tailwind CSS v4. All tokens live in `client/src/index.css`.

## Colour

| Scale | Use | Key shades |
|---|---|---|
| `brand` (indigo) | Primary buttons, links, focus rings, active nav, progress | `brand-600` `#444CE7` (fill), `brand-700` (hover, link text), `brand-50` (tints) |
| `gray` | Text, borders, surfaces | `gray-900` headings, `gray-700` labels, `gray-600` body/secondary, `gray-500` placeholders, `gray-300` input borders, `gray-200` dividers, `gray-50` hover and table headers |
| `success` / `warning` / `error` | Budget status and feedback only | `-50` background, `-200` ring, `-500` dot, `-700` text |

Green, amber and red are reserved for status, which is why the brand colour is indigo. shadcn's semantic variables (`--primary`, `--border`, `--ring`, …) point at these scales.

## Budget status

Status is never shown by colour alone. `BudgetStatusBadge` pairs each colour with an icon and a label.

| Status | Rule | Badge |
|---|---|---|
| `within` | under 80% of budget | success, check icon, "Within budget" |
| `approaching` | 80–100% | warning, triangle icon, "Approaching limit" |
| `over` | over 100% | error, cross icon, "Over budget" |
| `none` | no budget set | gray, minus icon, "No budget set" |

## Typography

Inter (variable). Text sizes follow Untitled UI line heights: `xs` 12/18, `sm` 14/20, `base` 16/24, `lg` 18/28, `xl` 20/30. Big numbers use `text-display-xs` (24/32), `display-sm` (30/38) or `display-md` (36/44). Headings and buttons are semibold (600), labels and badges medium (500). Money columns use `tabular-nums`.

## Shape and depth

| Token | Value | Used for |
|---|---|---|
| `rounded-lg` | 8px | buttons, inputs, selects, menus |
| `rounded-xl` | 12px | cards |
| `rounded-2xl` | 16px | dialogs |
| `rounded-full` | | badges, progress bars |
| `shadow-xs` | 1px soft | inputs, cards |
| `shadow-skeuomorphic` | inner border and bottom edge | buttons |
| `shadow-lg` / `shadow-xl` | soft, cool | menus / dialogs |

## Components

| Component | Sizes and variants |
|---|---|
| Button | `default` (primary), `secondary`/`outline` (white, outlined), `ghost` (tertiary), `destructive`, `link`; sizes `xs` 32, `sm` 36, `default` 40, `lg` 44, `xl` 48, plus `icon` sizes |
| Input / Select | 44px, 16px text, indigo focus ring, red border and ring when `aria-invalid` |
| Badge | `default` (gray), `brand`, `success`, `warning`, `destructive`, `outline`; sizes `sm`/`md`; optional `dot` |
| Card | white, gray-200 border, 12px radius, 20px padding (24px from `md`) |
| Table | gray-50 header, 12px medium gray-600 labels, 24px cell padding |
| Progress | 8px gray-200 track, value clamped to 0–100, `indicatorClassName` for status colour |
| Forms | shadcn `Field` (`FieldLabel`, `FieldDescription`, `FieldError`) with react-hook-form and zod |

## Money and dates

Amounts are stored in pesewas and shown as `GH₵1,250.00` with `Intl.NumberFormat`. Dates show as `5 Oct 2026`.

## Dark mode

Dark values are defined under `.dark` but not switched on. It's the first thing to cut if time runs short.
