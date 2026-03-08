# AGENTS.md

This file is the canonical reference for how AI agents, rules, and skills are organised in this project. It is platform-agnostic — the same structure is used by Claude, Cursor, GitHub Copilot, and any other AI tooling.

## Related files

| File              | Purpose                                                              |
| ----------------- | -------------------------------------------------------------------- |
| `ARCHITECTURE.md` | Project overview, tech stack, feature architecture, and run commands |
| `STYLING.md`      | Defra visual styling rules and component reference                   |
| `AGENTS.md`       | This file — AI agent system reference                                |

## Principle

All AI-specific content lives in `.agents/`. Platform configuration files (`CLAUDE.md`, `.cursor/rules/`, `.github/copilot-instructions.md`) are thin wrappers that point here. **Do not add rules, skills, or agent definitions directly to a platform file.** Add them to the appropriate place in `.agents/` instead.

## Directory Structure

```
.agents/
  rules/          # Project rules — loaded into agent instructions at runtime
  skills/         # Skills — one directory per skill, each containing a SKILL.md
  mastra/         # Mastra multi-agent orchestration (TypeScript plumbing only)
```

### `rules/`

Plain-markdown rule files. Each file covers one concern. Current rules:

| File                     | Covers                                                            |
| ------------------------ | ----------------------------------------------------------------- |
| `ai-agnosticism.md`      | Where AI content lives and why platform files are thin wrappers   |
| `code-style.md`          | Extract constants, use native fetch, split Nunjucks into sections |
| `server-architecture.md` | Feature and service directory structure, dependency flow, naming  |
| `styling.md`             | Defra component prefix, SCSS file locations, focus state rules    |
| `testing.md`             | Test naming, data organisation, assertion style                   |

To add a new rule: create or edit a file in `.agents/rules/`. Agents that need it will load it via `loadAgentInstructions()` in their TypeScript definition.

### `skills/` — current skills

| Skill                    | Triggered by                                               |
| ------------------------ | ---------------------------------------------------------- |
| `create-mastra-agent`    | Creating a new Mastra agent                                |
| `feature-spec`           | Writing a feature specification                            |
| `feature-plan`           | Planning a feature implementation                          |
| `feature-review-tests`   | Reviewing planned test names                               |
| `feature-review-styling` | Reviewing planned styling approach                         |
| `feature-write`          | Writing the feature implementation                         |
| `feature-review-code`    | Reviewing implemented code for consistency                 |
| `feature-docs-update`    | Updating documentation after completed work                |
| `feature-create-pr`      | Branching, committing, pushing, and opening a pull request |
| `routing`                | Routing user requests to the right skill                   |

### `skills/`

Each skill lives in its own directory: `.agents/skills/<skill-name>/SKILL.md`.

A `SKILL.md` must contain:

- `## Metadata` — YAML block with `triggers` list
- `## Persona` — the agent's instructions, loaded at runtime. This is the single source of truth for what the agent does and how it behaves.
- `## Input / Output` — description of what the skill receives and produces

The routing agent reads all `SKILL.md` files automatically to discover available agents. Do not register agents manually anywhere else.

To add a new skill: create `.agents/skills/<skill-name>/SKILL.md` with the sections above. If it needs a Mastra agent, use the `create-mastra-agent` skill.

### `mastra/`

TypeScript orchestration only. Agent files in this directory contain:

- Zod input/output schemas (the data contracts between pipeline steps)
- An `Agent` instantiation that loads its instructions from the corresponding `SKILL.md` via `loadAgentInstructions()`

No prose, personas, or rules are hardcoded in TypeScript. If you find instructions written directly into a TypeScript agent file, move them to the appropriate `SKILL.md` or rules file.

## Adding or Changing Things

| I want to…                                   | Where to change                                                               |
| -------------------------------------------- | ----------------------------------------------------------------------------- |
| Change how an agent behaves                  | Edit `## Persona` in its `SKILL.md`                                           |
| Add a project-wide coding rule               | Add or edit a file in `.agents/rules/`                                        |
| Wire a rule into an agent                    | Add the rules filename to `loadAgentInstructions()` in the agent's `.ts` file |
| Add a new skill/agent                        | Create `.agents/skills/<name>/SKILL.md`, then use `create-mastra-agent`       |
| Change the Mastra pipeline                   | Edit `.agents/mastra/pipeline-workflow.ts`                                    |
| Change data contracts between pipeline steps | Edit the Zod schemas in the relevant agent `.ts` file                         |
