import { Agent } from '@mastra/core'
import { z } from 'zod'
import { loadAgentInstructions } from './skill-loader.js'

export const FeatureSpecInput = z.object({
  goal: z.string().min(1).describe('Plain-language description of the feature to be specified'),
  featureName: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .describe('Kebab-case name for the feature, derived from the goal description'),
})

export const FeatureSpecOutput = z.object({
  featureName: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .describe('Kebab-case name for the feature, used as the agent-logs subdirectory'),
  specificationPath: z
    .string()
    .describe('Relative path to the written feature-specification.md file'),
  happyPaths: z
    .array(z.string())
    .describe('Names of all happy-path scenarios defined in the specification'),
  unhappyPaths: z
    .array(z.string())
    .describe('Names of all unhappy-path scenarios defined in the specification'),
  edgeCases: z
    .array(z.string())
    .describe('Names of all edge-case scenarios defined in the specification'),
})

export const featureSpecAgent = new Agent({
  id: 'feature-spec',
  name: 'Feature Spec',
  instructions: loadAgentInstructions('feature-spec'),
  model: 'claude-sonnet-4-6',
  tools: {},
})
