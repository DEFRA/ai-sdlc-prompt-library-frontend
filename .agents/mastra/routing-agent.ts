import { Agent } from '@mastra/core'
import { z } from 'zod'
import { loadAgentInstructions } from './skill-loader.js'
import type { AgentDescriptor } from './agent-directory-reader.js'

export const MAX_ROUTING_ITERATIONS = 10

export const RoutingInput = z.object({
  goal: z.string().min(1).describe('The high-level goal submitted by the developer or automated system'),
  availableAgents: z
    .array(
      z.object({
        name: z.string().describe('Human-readable agent name'),
        skillDirectory: z.string().describe('Directory name under .agents/skills/'),
        description: z.string().describe('One-sentence description of the agent'),
        triggerPhrases: z.array(z.string()).describe('Phrases that match this agent'),
      })
    )
    .describe('Agents currently registered in the routing network'),
  iterationCount: z
    .number()
    .int()
    .min(0)
    .describe('Number of routing loop iterations completed so far'),
})

export const RoutingOutput = z.object({
  selectedAgents: z
    .array(z.string())
    .describe('Ordered list of agent skill-directory names selected to fulfil the goal'),
  reasoning: z
    .string()
    .describe('Explanation of why these agents were selected in this order'),
  requiresClarification: z
    .boolean()
    .describe('Whether the goal is too vague to decompose without a clarifying question'),
  clarifyingQuestion: z
    .string()
    .optional()
    .describe('A single targeted clarifying question, present only when requiresClarification is true'),
  error: z
    .string()
    .optional()
    .describe('Error message when no agents could be matched to the goal'),
})

export const routingAgent = new Agent({
  id: 'routing',
  name: 'Routing Agent',
  instructions: loadAgentInstructions('routing'),
  model: 'claude-sonnet-4-6',
  tools: {},
})

export function routeGoal(goal: string, availableAgents: AgentDescriptor[]): Promise<RoutingOutput> {
  const input: z.infer<typeof RoutingInput> = {
    goal,
    availableAgents,
    iterationCount: 0,
  }

  return routingAgent
    .generate([{ role: 'user', content: JSON.stringify(input) }], { output: RoutingOutput })
    .then((result) => result.object)
}

export function askForClarification(goal: string): Promise<string> {
  const prompt = `The following goal is too vague to decompose reliably. Provide one targeted clarifying question that would allow you to determine the correct agent sequence:\n\nGoal: ${goal}`

  return routingAgent
    .generate([{ role: 'user', content: prompt }])
    .then((result) => result.text)
}
