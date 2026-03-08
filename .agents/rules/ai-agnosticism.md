# AI Agnosticism

All AI content lives in `.agents/`. Platform config files are thin wrappers that point there.

## Where things go

| Thing | Location |
|---|---|
| Coding rules | `.agents/rules/<concern>.md` |
| Agent persona / behaviour | `## Persona` in `.agents/skills/<name>/SKILL.md` |
| Agent orchestration | `.agents/mastra/` — TypeScript only, no prose |
| Platform wrappers | `CLAUDE.md`, `.cursor/rules/project.mdc`, `.github/copilot-instructions.md` |

## Rules

- Never write rules or personas directly into a platform file.
- Never hardcode prose or instructions in a Mastra TypeScript agent file.
- When you add a rule, add it to the relevant `.agents/rules/` file and update `AGENTS.md` if it changes the overall structure.
