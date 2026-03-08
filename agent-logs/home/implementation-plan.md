# Implementation Plan — home

## Files to edit

| File                                     | Change                                                                                                                                |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `src/server/features/home/view-model.js` | Replace tiles with three empty prompt card placeholders. Remove subnav items, version, and versionNote.                               |
| `src/server/features/home/index.njk`     | Rewrite page content: update hero copy, add intro section, render three empty prompt cards, remove version banner and subnav section. |

## Files unchanged

| File                                     | Reason                                                               |
| ---------------------------------------- | -------------------------------------------------------------------- |
| `src/server/features/home/controller.js` | No change — still delegates to view model and renders the same view. |
| `src/server/features/home/index.js`      | No change — route registration unchanged.                            |

---

## view-model.js

Remove `version`, `versionNote`, and `subnavItems`. Replace `tiles` with three prompt card objects — title only, no href, no body:

```js
const PROMPT_CARDS = [
  { title: 'Prompt one' },
  { title: 'Prompt two' },
  { title: 'Prompt three' }
]

export const homeViewModel = {
  get() {
    return {
      pageTitle: 'Defra AI Prompt Library',
      promptCards: PROMPT_CARDS
    }
  }
}
```

Cards have no `href` and no `body` — the template should not render a link or body paragraph when they are absent.

---

## index.njk

Structure:

1. **Hero** (`defra-hero`) — title "Defra AI Prompt Library", two-paragraph description in `govuk-body-l`:
   - Para 1: What the library is — a shared space for Defra teams to find and use the best AI prompts.
   - Para 2: The ambition — this isn't a dumping ground. Every prompt here has been reviewed and represents the standard Defra expects from AI-assisted work.
   - No `defra-hero__whats-new` aside.

2. **Intro section** — `govuk-width-container` > `defra-section` with a `govuk-heading-m` "About this library" and two short `govuk-body` paragraphs expanding on purpose and quality bar. No subnav alongside it.

3. **Prompt cards section** — `govuk-width-container` > `defra-section` with heading "Featured prompts" (`govuk-heading-l`), then a `govuk-grid-row` of three `govuk-grid-column-one-third` tiles. Each `defra-tile` renders the card title as a `govuk-heading-m` — no link, no body. Use `{% if card.href %}` guard so the template stays safe to extend later.

No version banner. No subnav.

---

## Tests

### Unit — `test/unit/features/home/view-model.test.js`

| Test name                                   | Type       |
| ------------------------------------------- | ---------- |
| `returns page title and three prompt cards` | Happy path |

### Integration — `test/integration/home.test.js`

| Test name                                                          | Type       |
| ------------------------------------------------------------------ | ---------- |
| `GET / returns homepage with prompt library title and three cards` | Happy path |

---

## Styling

No new SCSS required. All classes used are existing `defra-` components or `govuk-` utilities.
