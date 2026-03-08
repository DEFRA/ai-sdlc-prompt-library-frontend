# Code Style

## Extract constants

Never hardcode values inline. Extract all magic strings, numbers, and URLs to named constants.

- Module-level constants at the top of the file, before any function definitions.
- Constants shared across files go in `src/server/common/constants/`.
- Name constants in `SCREAMING_SNAKE_CASE`.

```js
// Bad
if (status === 'published') { ... }

// Good
const STATUS_PUBLISHED = 'published'
if (status === STATUS_PUBLISHED) { ... }
```

## HTTP calls

Use native `fetch` for all API calls. Do not use axios, node-fetch, got, or any other HTTP library.

## Nunjucks templates

Split templates into logical sections using `{% include %}` or `{% block %}`. A template should be readable at a glance — if a section is longer than ~30 lines, extract it.

- Partials live in `src/server/common/templates/partials/`.
- Feature-specific includes live alongside the feature template at `src/server/features/<name>/`.
