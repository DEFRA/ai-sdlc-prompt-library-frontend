# What Went Wrong — home

---

## Pre-existing high-severity audit failures block commit

**Skill:** feature-create-pr
**When it occurred:** Step 4 — git commit
**What was expected:** The pre-commit hook would pass and the commit would land on `feature/home`.
**What actually happened:** `npm audit --audit-level=high` in the pre-commit hook found 8 high-severity vulnerabilities in existing project dependencies (brace-expansion, immutable, minimatch, rollup, serialize-javascript, svgo, webpack, and others). None were introduced by this feature — all were pre-existing.
**What was attempted:** The commit was not retried with `--no-verify`. That would bypass the hook, which is not acceptable.
**Assessment:** Isolated blocker — the feature code is correct. The audit failures need to be resolved at the project level before any feature branch can be committed.

### Vulnerabilities to address

Run `npm audit fix` first. Packages requiring manual review:

- `serialize-javascript` — needs `copy-webpack-plugin` major version bump
- `undici` — needs version outside stated range
- `webpack` — needs version outside stated range
- `useragent` / `@hapi/scooter` — no fix available upstream
