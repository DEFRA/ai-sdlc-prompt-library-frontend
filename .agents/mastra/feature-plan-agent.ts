import { Agent } from '@mastra/core'
import { z } from 'zod'
import { loadAgentInstructions } from './skill-loader.js'

export const FeaturePlanInput = z.object({
  featureName: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .describe('Kebab-case name for the feature, used as the agent-logs subdirectory'),
  specificationPath: z
    .string()
    .describe('Relative path to the feature-specification.md file produced by feature-spec'),
  happyPaths: z
    .array(z.string())
    .describe('Names of all happy-path scenarios from the specification'),
  unhappyPaths: z
    .array(z.string())
    .describe('Names of all unhappy-path scenarios from the specification'),
  edgeCases: z
    .array(z.string())
    .describe('Names of all edge-case scenarios from the specification'),
})

export const FeaturePlanOutput = z.object({
  featureName: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .describe('Kebab-case name for the feature'),
  planPath: z
    .string()
    .describe('Relative path to the written implementation-plan.md file'),
  newFiles: z
    .array(z.string())
    .describe('Paths of files to be created as part of the implementation'),
  editedFiles: z
    .array(z.string())
    .describe('Paths of files to be modified as part of the implementation'),
  testNames: z
    .array(z.string())
    .describe('Exact test names as they will appear in the test files'),
})

export const featurePlanAgent = new Agent({
  id: 'feature-plan',
  name: 'Feature Plan',
  instructions: loadAgentInstructions('feature-plan', ['server-architecture.md', 'code-style.md']),
  model: 'claude-sonnet-4-6',
  tools: {},
})
