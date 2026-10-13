# Retain design

The UI imitates the [Untitled UI](https://www.untitledui.com/) **v8** Figma kit, built on shadcn/ui components (Radix) restyled with Tailwind CSS v4. The brand colour is **indigo** instead of Untitled's purple. All tokens live in `client/src/index.css`.

## Tokens use the Figma names

Figma variables map one to one to classes, so a frame translates directly:

| Figma variable | Class | Light | Dark |
|---|---|---|---|
| `text-primary (900)` | `text-primary` | gray-900 | gray-50 |
| `text-secondary (700)` | `text-secondary` | gray-700 | gray-300 |
| `text-tertiary (600)` | `text-tertiary` | gray-600 | gray-400 |
| `text-quaternary (500)` | `text-quaternary` | gray-500 | gray-400 |
| `text-placeholder` | `text-placeholder` | gray-500 | gray-500 |
| `text-brand-secondary (700)` | `text-brand-secondary` | brand-700 | gray-300 |
| `fg-quaternary (400)` (icons) | `text-fg-quaternary` | gray-400 | gray-600 |
| `bg-primary` | `bg-primary` | white | gray-950 |
| `bg-primary_alt` | `bg-primary_alt` | white | gray-900 |
| `bg-primary_hover` | `bg-primary_hover` | gray-50 | gray-800 |
| `bg-secondary` / `bg-secondary_alt` | `bg-secondary` / `bg-secondary_alt` | gray-50 | gray-900 / gray-950 |
| `bg-active` | `bg-active` | gray-50 | gray-800 |
| `bg-brand-solid` | `bg-brand-solid` | brand-600 | brand-600 |
| `border-primary` | `border-primary` | gray-300 | gray-700 |
| `border-secondary` | `border-secondary` (default border) | gray-200 | gray-800 |

`text-primary`, `bg-primary` and `border-primary` are different colours: Tailwind reads them from separate `--text-color-*`, `--background-color-*` and `--border-color-*` namespaces. `_hover` tokens are their hover states (`hover:bg-primary_hover`).

Raw scales (`gray`, `brand`, `error`, `warning`, `success`) are for fixed colours only. Gray is v8's neutral scale (`#171717`, `#525252`, `#d4d4d4`, ...).

**Utility colours** (`bg-utility-success-50`, `text-utility-success-700`, `ring-utility-success-200`, `-500` for dots) are for badges, alerts and status, and they flip in dark mode.

## Dark mode

`next-themes` toggles a `.dark` class on `<html>`; the `.dark` block in `index.css` swaps every semantic and utility token, so components never need `dark:` classes. It follows the system until the user picks a theme (saved in `localStorage`); an inline script in `index.html` applies it before React loads, so there's no flash. Toggle: "Dark mode" / "Light mode" in the account card menu at the bottom of the sidebar (not on the auth pages).

## Budget status

Status is never colour alone. `BudgetStatusBadge` pairs each colour with an icon and a label.

| Status | Rule | Badge |
|---|---|---|
| `within` | under 80% of budget | success, check icon, "Within budget" |
| `approaching` | 80–100% | warning, triangle icon, "Approaching limit" |
| `over` | over 100% | error, cross icon, "Over budget" |
| `none` | no budget set | gray, minus icon, "No budget set" |

Green, amber and red are reserved for status, which is why the brand is indigo.

## Typography

Inter (variable). `text-xs` 12/18, `text-sm` 14/20, `text-base` 16/24, `text-lg` 18/28, `text-xl` 20/30, `text-display-xs` 24/32, `display-sm` 30/38, `display-md` 36/44. Headings and buttons semibold (600), labels medium (500). Money columns use `tabular-nums`.

## Shape, depth and spacing

- Radius: `rounded-lg` 8px (buttons, inputs, tabs), `rounded-xl` 12px (cards), `rounded-2xl` 16px (dialogs), `rounded-full` (badges).
- Shadows: `shadow-xs` (inputs, cards), `shadow-skeuomorphic` (buttons: inner border + bottom edge), `shadow-lg` / `shadow-xl` (menus / dialogs). Solid buttons add a 2px `inset-ring-white/12` highlight.
- Form rhythm (from the Figma auth frames): label → input 6px, field → field 20px, form → button 24px, sections 32px.

## Components

| Component | Notes |
|---|---|
| Button | `default` (primary), `secondary`/`outline`, `ghost` (tertiary), `destructive`, `link`; sizes `xs` 32, `sm` 36, `default` 40, `lg` 44, `xl` 48, plus `icon` sizes |
| Input / Select | 44px, 16px text, `border-primary`, brand border and 4px ring on focus, `border-error_subtle` when `aria-invalid` |
| TextField / PasswordField | label + input + error or hint; `PasswordField` adds the show/hide eye |
| Badge | `default` (gray), `brand`, `success`, `warning`, `destructive`, `outline`; sizes `sm`/`md`; optional `dot` |
| Card | `bg-primary`, `border-secondary`, 12px radius, 20px padding (24px from `md`) |
| Table | `bg-secondary` header, 12px medium labels, 24px cell padding |
| Progress | 8px `bg-quaternary` track, value clamped to 0–100, `indicatorClassName` for status colour |
| Logomark | Untitled-style indigo (`brand-600`) tile with a faint grid and a white wallet icon (`components/Logo.tsx`) |

## Pages built from Figma frames

| Page | Frame |
|---|---|
| Log in / Sign up | "Sign up – Split" on desktop (≥ lg): logo top-left, 360px form column centred in the left half, and an indigo brand panel on the right (`AuthShowcase`: tagline plus a decorative dashboard mock, `aria-hidden`). Below lg it's "Sign up – Simple": logo centred above a 360px column, 96px (tablet) / 48px (mobile) from the top, no card. Shared: Sign up / Log in tabs (no separate "Already have an account?" link), password eye toggle, live requirement checklist |
| App shell | "Dashboard" desktop (1440) and mobile (375), sidebar navigation and page header (details below) |

## App shell

- **Desktop (lg+):** no top bar. A 280px sticky sidebar with a 4px inset holds a floating card (`border-secondary`, 12px radius, `shadow-xs`):
  - header: 24px logomark + wordmark, 20px padding (Untitled's search box is left out; Retain has no global search)
  - nav items: 36px, 8px padding, 6px radius, 14px semibold `text-secondary`, 20px `fg-quaternary` icon, 2px apart; active = `bg-active` + `text-secondary_hover`
  - sections split by a `border-secondary` divider; Admin is its own section, admins only
  - footer: account card (40px initials avatar, name, email, ⇅ icon) opening a menu with Dark/Light mode and Log out
- **Mobile (< lg):** 56px top bar (`border-secondary` bottom border, 16px / 12px padding) with the logo and a 36px menu button that opens the same sidebar as a 280px drawer.
- **Main:** 32px top, 48px bottom, 32px sides (16px on mobile), max width 1280px.
- **Page header:** 20px semibold title (`text-xl`), optional `text-tertiary` supporting text 2px below, actions (small secondary buttons, 12px apart) on the right that wrap underneath on narrow screens.

## Money and dates

Amounts are stored as whole Rwandan francs and shown as `RF 12,550` with `Intl.NumberFormat` (`en-RW`). Dates show as `5 Oct 2026`.
