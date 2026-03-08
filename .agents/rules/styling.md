# Styling

Full visual reference is in `STYLING.md`. This file contains the rules agents must follow.

## Principles

- Use GOV.UK Frontend classes for all typography, layout, spacing, and standard components. Do not redefine them.
- All custom Defra components use the `defra-` prefix. Never use `app-` or unprefixed class names.
- Never modify `govuk-` classes directly.
- No rounded corners — `border-radius: 0` everywhere.
- Focus states must follow the GOV.UK yellow pattern — do not modify it.

## SCSS structure

| Path | Purpose |
|---|---|
| `src/client/stylesheets/variables/_colours.scss` | Defra brand colour variables |
| `src/client/stylesheets/components/_defra-<name>.scss` | One file per Defra component |
| `src/client/stylesheets/components/_index.scss` | Imports all component files |

To add a new component: create `_defra-<name>.scss`, add `@use "defra-<name>";` to `_index.scss`.

Use `$defra-green` (`#008531`), `$defra-green-light` (`#00a33b`), `$defra-green-dark` (`#006a27`) from `variables/colours`.

## Defra components

| Component | File |
|---|---|
| `defra-header` | `_defra-header.scss` |
| `defra-service-navigation` | `_defra-service-navigation.scss` |
| `defra-hero` | `_defra-hero.scss` |
| `defra-version-banner` | `_defra-version-banner.scss` |
| `defra-tile` | `_defra-tile.scss` |
| `defra-section` | `_defra-section.scss` |
| `defra-footer` | `_defra-footer.scss` |
| `defra-breadcrumbs--inverse` | `_defra-breadcrumbs.scss` |
| `defra-subnav__link` | `_defra-subnav.scss` |
