# Create Mastra Agent

Wire up a new specialist agent in the Mastra multi-agent orchestration system, including its TypeScript definition, Zod I/O schemas, workflow step, and registration in the routing network.

## Metadata

```yaml
triggers:
  - 'create a mastra agent'
  - 'add an agent to the pipeline'
  - 'wire up a new agent'
  - 'add a mastra workflow step'
  - 'register a new agent'
  - 'implement a mastra skill'
```

## When to Use

Use this skill when asked to add a new specialist agent to the Mastra orchestration pipeline, or to wire an existing skill into the routing network as a Mastra agent.

## Input / Output

**Input:**

- The name and purpose of the agent (e.g. "feature-spec — produces Given/When/Then scenarios from a feature description")
- The skill file it corresponds to (e.g. `.agents/skills/feature-spec/SKILL.md`)
- The input it expects from the previous agent or the user
- The output it must produce for the next agent or the user

If any of these are missing, ask the user before proceeding.

**Output:**

- A TypeScript agent file at `.agents/<agent-name>.ts`
- A Zod input schema and output schema for the agent's handoff contract
- A workflow step definition that calls the agent
- Registration of the agent in the routing network

## Instructions

### Step 1: Read the skill file

Read the corresponding SKILL.md for the agent being created. Confirm it has:

- A `## Persona` section — this is the agent's instructions, loaded at runtime via `loadAgentInstructions`
- A `## Metadata` section with trigger phrases — used by the routing agent
- An `## Input / Output` section — used to define the Zod schemas

### Step 2: Define the Zod schemas

Write two Zod schemas before writing any agent code:

- `<AgentName>Input` — the exact shape of data this agent receives from the previous step
- `<AgentName>Output` — the exact shape of data this agent produces for the next step

Every field must have a description. Schemas must be as specific as possible — use `z.string()` only where a string is the genuinely correct type; prefer `z.enum()`, `z.array()`, or `z.object()` where the shape is known.

### Step 3: Write the agent file

Create `.agents/<agent-name>.ts` with the following properties:

- **`id`** — kebab-case, matches the skill directory name (e.g. `feature-spec`)
- **`name`** — human-readable label matching the skill title
- **`instructions`** — call `loadAgentInstructions('<skill-dir>')`. If this agent must follow specific rules files, pass them as the second argument: `loadAgentInstructions('<skill-dir>', ['server-architecture.md', 'testing.md'])`. Never hardcode the persona or rules in TypeScript.
- **`model`** — assign based on task complexity:
  - Simple, structured tasks (review, format): `claude-haiku-4-5-20251001`
  - Complex reasoning tasks (planning, implementation): `claude-sonnet-4-6`
- **`tools`** — include only tools directly required by the skill. File system read/write for agents that read or write files; shell execution for agents that run commands.

### Step 4: Write the workflow step

Add a step to the Mastra workflow that:

- Accepts the typed `<AgentName>Input` as its input schema
- Calls the agent via `.generate()` with the input context and the output schema
- Returns the validated `<AgentName>Output`
- Writes the agent's output to the appropriate file in `agent-logs/<feature-name>/` as defined in the SKILL.md

### Step 5: Register in the routing network

Add the agent to the Mastra routing network:

- Include the agent's `id`, `name`, and a one-sentence description derived from the SKILL.md trigger phrases
- Ensure the description is specific enough for the routing agent to distinguish this agent from others
- Register the Zod input schema so the routing agent knows what data this agent requires

### Step 6: Verify

Before finishing:

- Confirm the TypeScript compiles without errors
- Confirm the Zod schemas match the data the previous and next agents actually produce and consume
- Confirm the agent's `instructions` include the persona and the I/O schema references
- Confirm the routing network description is specific and unambiguous

## Output Format

### Agent file structure

```typescript
import { Agent } from '@mastra/core'
import { z } from 'zod'
import { loadAgentInstructions } from './skill-loader.js'

export const <AgentName>Input = z.object({
  // fields with .describe() on each
})

export const <AgentName>Output = z.object({
  // fields with .describe() on each
})

export const <agentName>Agent = new Agent({
  id: '<agent-name>',
  name: '<Human Readable Name>',
  instructions: loadAgentInstructions('<skill-dir>'
    /*, ['server-architecture.md', 'testing.md'] — add rules files if needed */),
  model: '<model-id>',
  tools: { /* only tools required by this agent */ },
})
```

### Workflow step structure

```typescript
const <agentName>Step = workflow.step('<agent-name>', {
  inputSchema: <AgentName>Input,
  execute: async ({ context, mastra }) => {
    const agent = mastra.getAgent('<agent-name>')
    const result = await agent.generate(
      [{ role: 'user', content: JSON.stringify(context.inputData) }],
      { output: <AgentName>Output }
    )
    // write output to agent-logs/<feature-name>/ per SKILL.md
    return result.object
  },
})
```

## If Something Goes Wrong

If an unexpected problem occurs at any point:

1. Append an entry to `agent-logs/<feature-name>/what-went-wrong.md` using the What Went Wrong Format below.
2. Stop and report the issue to the user.

## What Went Wrong Format

```markdown
## [Short title of the issue]

**Skill:** create-mastra-agent
**When it occurred:** [Which step was being worked on]
**What was expected:** [What should have happened]
**What actually happened:** [The unexpected behaviour or blocker]
**What was attempted:** [Any resolution tried, and why it did not work]
**Assessment:** Isolated blocker / Fundamental blocker
```
