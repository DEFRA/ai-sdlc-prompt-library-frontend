# Code Review — home

## Findings

---

#### Inline styles on prompt card list

**Severity:** Suggestion
**Complexity to fix:** Small

`_prompt-cards.njk` resets list styles with `style="list-style:none;padding:0;margin:0;"` inline on the `<ul>`. Inline styles are not consistent with how the rest of the templates handle layout — everything else uses GOV.UK or `defra-` utility classes. The `defra-tile-grid` class was used in the previous homepage for exactly this purpose and should be reapplied here.

---

#### Nunjucks server-wide search path added

**Severity:** Suggestion
**Complexity to fix:** Small

`src/config/nunjucks/nunjucks.js` now includes the full `src/server/` directory as a Nunjucks search path to support feature-level `{% include %}` partials. This is correct and enables the template-splitting pattern. It should be noted in `ARCHITECTURE.md` so future developers understand why `server/` is in the search paths and do not remove it thinking it is redundant.

---

## Summary

No Critical findings. The code is clear to commit. Two Suggestions noted for discretionary follow-up: the inline list reset on the prompt cards `<ul>` should use `defra-tile-grid` to match the existing pattern, and the Nunjucks search path addition warrants a one-line note in ARCHITECTURE.md.
