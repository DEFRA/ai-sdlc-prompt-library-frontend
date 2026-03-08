# SCSS

Rules for writing and maintaining styles in this application.

## Scope

Applies to all `.scss` files in `src/`.

## Core Principle

Maximise style reuse. Minimise new styles.

## Class Naming

- All custom classes must use the `app-` prefix.

## Styling Priority (Follow in Order)

1. **Reuse existing app styles** — always check first. Prefer consistency over a perfect design match.
2. **Use GOV.UK Design System** — search `node_modules/govuk-frontend` for applicable components and utilities.
3. **Create new styles only as a last resort** — requires explicit user approval before adding any new `app-` class.

## Rules

- Never rewrite or duplicate existing styles.
- Never create new styles without first exhausting options 1 and 2 above.
- Always seek explicit user approval before introducing any new `app-` classes.
- Always extract and reuse hardcoded values as variables (e.g. colours, dimensions).
