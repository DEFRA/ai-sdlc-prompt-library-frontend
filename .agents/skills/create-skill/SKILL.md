# Write Skill File

Create a task-oriented skill in `.agents/skills/` that guides an agent through a specific, repeatable workflow.

## Metadata

```yaml
triggers:
  - 'create a skill'
  - 'write a skill file'
  - 'add a skill'
  - 'new agent skill'
  - 'write a workflow'
```

## When to Use

Use this skill when asked to create, add, or write a skill file for a repeatable task or workflow that an agent should follow.

## Instructions

### Step 1: Clarify the task

Determine exactly what task the skill will help accomplish. The skill name must be a verb-phrase answering: "What task does this help accomplish?"

- Good: `write-skill/`, `code-review/`, `plan-feature/`, `write-migration/`
- Bad: `utils/`, `frontend/`, `testing/`, `standards/`

If the task is unclear, ask the user before proceeding.

### Step 2: Identify the trigger

Write the trigger conditions — the specific phrases or situations that tell the agent to load this skill. This is the most critical part of the skill: poor triggers mean the skill is never found.

- Triggers must be concrete phrases, not vague categories.
- Include 3–6 trigger phrases covering natural variations of the request.
- Good: `"create API endpoint"`, `"write a migration"`, `"review this PR"`
- Bad: `"coding"`, `"help with tests"`, `"do a thing"`

### Step 3: Define inputs and outputs

Before writing the procedure, explicitly state:

- **Input:** What information the agent needs to begin (e.g., task name, scope, user-provided constraints).
- **Output:** What the final deliverable looks like (e.g., a file at a specific path, a structured response).

Unambiguous inputs and outputs dramatically increase agent success rates.

### Step 4: Write the procedure

Write ordered steps for completing the task. Each step must:

- Start with a bold action label: `**1. Step name.**`
- Describe one concrete action.
- Avoid vague instructions like "consider X" — state exactly what to do.

### Step 5: Apply the checklist

Verify every item below before writing the file:

- [ ] The skill name is a verb-phrase in kebab-case
- [ ] The `triggers` metadata lists 3–6 concrete, unambiguous phrases
- [ ] Inputs and outputs are explicitly defined
- [ ] Every procedure step is a positive imperative command
- [ ] No coding conventions are included (those belong in `.agents/rules/`)
- [ ] No project-wide setup is included (that belongs in `AGENTS.md`)
- [ ] The file is self-contained with no external links
- [ ] The file is under 300 lines

### Step 6: Write the file

Create the skill at `.agents/skills/<verb-phrase>/SKILL.md`.

## Output Format

The skill file must follow this structure:

```markdown
# [Task Name]

[One sentence: what task this skill helps accomplish.]

## Metadata

triggers:

- "[trigger phrase]"
- "[trigger phrase]"

## When to Use

Use this skill when [concrete trigger description].

## Instructions

### [Step heading]

[Concrete action in imperative voice.]

## Output

**Input:** [What the agent needs to start]
**Output:** [What the deliverable looks like — file path, format, or structure]
```
