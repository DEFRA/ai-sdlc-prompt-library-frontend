import { Agent } from '@mastra/core'
import { z } from 'zod'
import { loadAgentInstructions } from './skill-loader.js'

export const DocsUpdateInput = z.object({
  featureName: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .describe('Kebab-case name for the feature, used to locate the agent-logs directory'),
  agentLogsPath: z
    .string()
    .describe('Relative path to the agent-logs/<feature-name>/ directory for this piece of work'),
})

export const DocsUpdateOutput = z.object({
  featureName: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .describe('Kebab-case name for the feature'),
  outputPath: z
    .string()
    .describe('Relative path to the written docs-update.md file'),
  documentationChangesApplied: z
    .array(z.string())
    .describe('List of documentation files that were updated directly'),
  ruleSuggestionsCount: z
    .number()
    .int()
    .min(0)
    .describe('Number of candidate rule additions included in the output document'),
})

export const docsUpdateAgent = new Agent({
  id: 'feature-docs-update',
  name: 'Feature Docs Update',
  instructions: loadAgentInstructions('feature-docs-update', ['ai-agnosticism.md', 'server-architecture.md']),
  model: 'claude-sonnet-4-6',
  tools: {},
})
