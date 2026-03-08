# Defra Visual Styling Rules

> This file defines the visual rules for building Defra digital services. It relies on **GOV.UK Frontend** (`govuk-frontend` npm package) as the base styling system. Do not redefine GOV.UK styles — use the classes directly. Custom Defra components use the `defra-` prefix following GOV.UK BEM conventions.
>
> **Reference:** https://design-system.service.gov.uk/styles/

---

## 1. Foundation: GOV.UK Frontend

All pages must include `govuk-frontend` CSS. Use the rebranded template class:

```html
<html class="govuk-template govuk-template--rebranded">
```

### Font

Use `Helvetica, Arial, sans-serif` only. Do not use GDS Transport. Apply to `body` and inherit everywhere.

---

## 2. Colour Palette

Use GOV.UK colour classes wherever possible. The following are Defra-specific overrides only.

### Defra Brand Colours

| Variable | Hex | Usage |
|----------|-----|-------|
| `$defra-green` | `#008531` | Nav, hero, footer border, version label, tile hover border, active indicators |
| `$defra-green-light` | `#00a33b` | Header service name, logo |
| `$defra-green-dark` | `#006a27` | Button hover |

Defra colour variables are defined in `src/client/stylesheets/variables/_colours.scss`.

### GOV.UK Colours (use as-is, do not redefine)

Refer to https://design-system.service.gov.uk/styles/colour/

---

## 3. Typography

Use GOV.UK heading and body classes directly. Do not define custom font sizes.

**Headings:** `govuk-heading-xl`, `govuk-heading-l`, `govuk-heading-m`, `govuk-heading-s`

**Body:** `govuk-body-l`, `govuk-body`, `govuk-body-s`

**Captions:** `govuk-caption-xl`, `govuk-caption-l`, `govuk-caption-m`

**Lists:** `govuk-list`, `govuk-list--bullet`, `govuk-list--number`

**Links:** Use default `govuk-link` behaviour. See https://design-system.service.gov.uk/styles/links/

---

## 4. Layout

Use the GOV.UK layout system. See https://design-system.service.gov.uk/styles/layout/

**Container:** `govuk-width-container` (960px max)

**Grid row:** `govuk-grid-row`

**Columns:** `govuk-grid-column-full`, `govuk-grid-column-three-quarters`, `govuk-grid-column-two-thirds`, `govuk-grid-column-one-half`, `govuk-grid-column-one-third`, `govuk-grid-column-one-quarter`

**Main wrapper:** `govuk-main-wrapper`

---

## 5. Spacing

Use GOV.UK spacing override classes. See https://design-system.service.gov.uk/styles/spacing/

**Margin:** `govuk-!-margin-{0-9}`, `govuk-!-margin-top-{0-9}`, etc.

**Padding:** `govuk-!-padding-{0-9}`, `govuk-!-padding-top-{0-9}`, etc.

**Section breaks:** `govuk-section-break`, `govuk-section-break--visible`, `govuk-section-break--l`, `govuk-section-break--m`, `govuk-section-break--xl`

---

## 6. GOV.UK Components Used

Use these directly from `govuk-frontend`. Do not restyle them.

- `govuk-skip-link`
- `govuk-breadcrumbs` / `govuk-breadcrumbs__list` / `govuk-breadcrumbs__link`
- `govuk-button` / `govuk-button--secondary` / `govuk-button--start`
- `govuk-tag`
- `govuk-accordion`
- `govuk-details`
- `govuk-inset-text`
- `govuk-error-summary` / `govuk-error-message`
- `govuk-table` / `govuk-table__header` / `govuk-table__cell`
- `govuk-summary-list`
- `govuk-notification-banner`
- `govuk-tabs`
- `govuk-back-link`

---

## 7. Defra Custom Components

All custom components use the `defra-` prefix. Never use `app-` or unprefixed class names for new Defra components.

Each component has its own SCSS file in `src/client/stylesheets/components/`. All files are imported via `src/client/stylesheets/components/_index.scss`.

### Where to add CSS

| File | Component |
|------|-----------|
| `components/_defra-header.scss` | 7.1 Header |
| `components/_defra-service-navigation.scss` | 7.2 Service Navigation |
| `components/_defra-hero.scss` | 7.3 Hero Banner |
| `components/_defra-version-banner.scss` | 7.4 Version Banner |
| `components/_defra-tile.scss` | 7.5 Tiles |
| `components/_defra-section.scss` | 7.6 Sections |
| `components/_defra-footer.scss` | 7.8 Footer |
| `components/_defra-breadcrumbs.scss` | 7.9 Breadcrumbs (Inverse) |
| `components/_defra-subnav.scss` | 7.10 Side Navigation |

### 7.1 Header

`defra-header` — white background, CSS grid layout. Replaces `govuk-header`. Includes `defra-header__logo` (60px height) and `defra-header__service-name` (Defra green, 22px, 700 weight). Focus uses the standard GOV.UK yellow focus pattern.

**Mobile (≤768px):** Logo shrinks to 45px, service name to 18px.

### 7.2 Service Navigation

`defra-service-navigation` — Defra green background bar below the header. Contains `defra-service-navigation__list` (flex row of links). Active page uses `aria-current="page"` which triggers bold weight and white underline. Focus uses the GOV.UK yellow pattern.

### 7.3 Hero Banner

`defra-hero` — full-width Defra green banner. Uses `govuk-heading-xl` and `govuk-body-l` inside — text colour forced to white. Uses `govuk-grid-row` internally for two-thirds / one-third layout. `defra-hero__whats-new` is a bordered aside panel inside the hero.

### 7.4 Version Banner

`defra-version-banner` — grey bordered strip. Contains `defra-version-banner__label` (green pill with version number) and `defra-version-banner__text`. Links inside use standard `govuk-link` styling.

### 7.5 Tiles

`defra-tile` — white bordered card with minimum height of 140px. Used in `govuk-grid-row` with `govuk-grid-column-one-third` columns. The `defra-tile__link::after` pseudo-element makes the entire card clickable. On hover, the tile lifts 1px and gains a Defra green border. Focus is handled by the parent tile, not the link directly. Visited links stay blue (`#1d70b8`), never purple.

### 7.6 Sections

`defra-section` — adds top margin between page sections. Use `govuk-section-break govuk-section-break--visible govuk-section-break--l` between sections as a separator rule.

### 7.8 Footer

`defra-footer` — light grey background with a 10px Defra green top border. Replaces `govuk-footer`. Links use `defra-footer__link` (black, standard GOV.UK focus ring).

### 7.9 Breadcrumbs (Inverse)

`defra-breadcrumbs--inverse` — modifier class applied to `govuk-breadcrumbs` for use on dark backgrounds (e.g. inside the hero). Forces link colour to white, restores GOV.UK yellow on focus.

### 7.10 Side Navigation

`defra-subnav__link` — standard link style for subnav items. `defra-subnav__link--current` — active state with Defra green left border, grey background, bold weight.

---

## 8. Focus States

Follow the GOV.UK focus state pattern everywhere. See https://design-system.service.gov.uk/get-started/focus-states/

```
background-color: #fd0
box-shadow: 0 -2px #fd0, 0 4px #0b0c0c
outline: 3px solid transparent
color: #0b0c0c
text-decoration: none
```

Do not modify this pattern.

---

## 9. Responsive Breakpoints

Use GOV.UK Frontend breakpoints:

| Name | Value |
|------|-------|
| Mobile | `20rem` (320px) |
| Tablet | `40.0625rem` (641px) |
| Desktop | `48.0625rem` (769px) |

Additional Defra breakpoints: `768px` (nav collapse), `480px` (small mobile).

---

## 10. Rules

1. **Always use GOV.UK Frontend classes** for typography, layout, spacing, and standard components. Do not redefine them.
2. **Use the `defra-` prefix** for all custom components. Never modify `govuk-` classes directly.
3. **No rounded corners.** `border-radius: 0` everywhere.
4. **Tile visited links stay blue** — `#1d70b8`, not `#4c2c92`.
5. **Tiles must have `min-height: 140px`** and the full-coverage `::after` pseudo-element link.
6. **Tile hover must lift** — `transform: translateY(-1px)` with Defra green border.
7. **Navigation is `#008531`** (Defra green), not `#1d70b8` (GOV.UK blue).
8. **Header is white background** with CSS grid — not the standard `govuk-header`.
9. **Footer uses `defra-footer`** with `#008531` top border — not the standard `govuk-footer`.
10. **Focus states must follow the GOV.UK pattern** — yellow background, black text, 3px outline.
