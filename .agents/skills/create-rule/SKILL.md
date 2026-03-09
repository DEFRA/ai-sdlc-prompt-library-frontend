# Write Rules File

Create a scoped domain rules file in `.agents/rules/` that governs coding conventions for a specific area of the codebase.

## Metadata

```yaml
triggers:
  - 'create a rules file'
  - 'write a rules file'
  - 'add a rule'
  - 'add coding standards'
  - 'write coding conventions'
  - 'new rules for'
```

## When to Use

Use this skill when asked to create, add, or write a rules file, coding standards, or conventions for a specific domain or area of the codebase.

## Input / Output

**Input:** The domain or area the rules should govern (e.g., "testing", "API design"). If not provided, ask the user before proceeding.
**Output:** A new file at `.agents/rules/<domain-name>.md` following the template in the Output Format section below.

## Instructions

### Step 1: Identify the domain

Determine what area or file type the rules govern (e.g., testing, API design, frontend components). If unclear, ask the user to clarify the scope before proceeding.

### Step 2: Choose a name

Name the file with a noun or noun-phrase identifying the domain in kebab-case. The name must answer: "What area does this govern?"

- Good: `testing.md`, `api-design.md`, `frontend-components.md`
- Bad: `rules.md`, `important.md`, `misc.md`

### Step 3: Draft the content

Write the file following the Output Format template below. Keep it under 200 lines. Every line must directly impact how code is written in the domain.

### Step 4: Apply the checklist

Verify every item in the checklist below before writing the file.

### Step 5: Write the file

Create the file at `.agents/rules/<name>.md`.

### Step 6: Update AGENTS.md

If the new rule changes the overall structure of the agent system or introduces a concern not previously documented, update `AGENTS.md` to reflect it.

## Output Format

The rules file must follow this structure:

```markdown
# [Domain Name]

[One sentence: what this rule governs and when it applies.]

## Scope

This applies to [describe the files, directories, or type of work this covers].

## [Section heading]

- [Directive written as a positive, imperative command]
- [Directive written as a positive, imperative command]

## Example

[Short before/after or ✅/❌ snippet for any directive that could be ambiguous]
```

### Content rules

- Write every directive as a positive imperative: "Use X" not "Don't use Y" or "You should consider X".
- Define measurable goals where possible: "Write functions under 20 lines" not "Keep functions short".
- State each idea once — do not repeat a concept in multiple sections.
- Include a code example only where a directive might be ambiguous without one. Skip obvious ones.
- Do not include step-by-step procedures ("First do X, then do Y") — those belong in a skill, not a rule.
- Do not include project-wide commands or setup — those belong in `AGENTS.md`.

## Checklist

Verify before writing the file:

- [ ] Every directive is a positive imperative command
- [ ] Each directive has measurable or concrete success criteria
- [ ] Ambiguous directives include a short code example
- [ ] No concept is repeated across sections
- [ ] The file uses markdown headings and bullet points for hierarchy
- [ ] The file is self-contained — no external links
- [ ] The file is as short as possible while remaining complete (target: under 200 lines)
