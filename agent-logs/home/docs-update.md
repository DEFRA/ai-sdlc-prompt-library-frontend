# Docs Update — home

## Documentation changes applied

| File              | What changed                                                                  |
| ----------------- | ----------------------------------------------------------------------------- |
| `ARCHITECTURE.md` | Added note about Nunjucks `src/server` search path under Feature Architecture |

---

## Suggested rule additions

---

#### Note the Nunjucks server search path in ARCHITECTURE.md

**Target file:** `ARCHITECTURE.md`
**Wire into agents:** none

Document that `src/server/` is included as a Nunjucks search path to support feature-level template partials via `{% include %}`.

**Rationale:** The code review identified this as an unexplained addition that future developers could remove, thinking it was redundant.

---

## Summary

One documentation change applied directly: a note added to ARCHITECTURE.md explaining the Nunjucks search path. One suggestion raised from the code review. No new rules required — the template-splitting pattern is already covered by `code-style.md`.
