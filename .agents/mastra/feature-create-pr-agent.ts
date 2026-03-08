import { Agent } from '@mastra/core'
import { z } from 'zod'
import { loadAgentInstructions } from './skill-loader.js'
import { shellTool } from './shell-tool.js'

export const CreatePrInput = z.object({
  featureName: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .describe('Kebab-case name for the feature'),
  implementedFiles: z
    .array(z.string())
    .describe('Paths of all source files created or modified during implementation — staged in the commit'),
  specificationPath: z
    .string()
    .describe('Relative path to the feature-specification.md file'),
  planPath: z
    .string()
    .describe('Relative path to the implementation-plan.md file'),
  clearedToCommit: z
    .boolean()
    .describe('Must be true — set by feature-review-code. If false the agent stops immediately.'),
  documentationChangesApplied: z
    .array(z.string())
    .describe('Documentation files updated by feature-docs-update — included in the commit'),
})

export const CreatePrOutput = z.object({
  featureName: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .describe('Kebab-case name for the feature'),
  branchName: z
    .string()
    .describe('Name of the branch that was pushed, e.g. feature/my-feature'),
  commitMessage: z
    .string()
    .describe('The short commit message used'),
  prUrl: z
    .string()
    .url()
    .describe('URL of the created pull request'),
})

export const featureCreatePrAgent = new Agent({
  id: 'feature-create-pr',
  name: 'Feature Create PR',
  instructions: loadAgentInstructions('feature-create-pr'),
  model: 'claude-sonnet-4-6',
  tools: { shellTool },
})
