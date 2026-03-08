import { Agent } from '@mastra/core'
import { z } from 'zod'
import { loadAgentInstructions } from './skill-loader.js'

export const ReviewStylingInput = z.object({
  featureName: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .describe('Kebab-case name for the feature'),
  planPath: z
    .string()
    .describe('Relative path to the implementation-plan.md file reviewed by feature-review-tests'),
  newFiles: z
    .array(z.string())
    .describe('Paths of files to be created, used to identify view or template files'),
  editedFiles: z
    .array(z.string())
    .describe('Paths of files to be modified, used to identify view or template files'),
})

export const ReviewStylingOutput = z.object({
  featureName: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .describe('Kebab-case name for the feature'),
  updatedPlanPath: z
    .string()
    .describe('Relative path to the implementation-plan.md file with Styling Guidance appended'),
  stylingRequired: z
    .boolean()
    .describe('Whether any template or view files were found requiring styling decisions'),
  govukClassCount: z
    .number()
    .int()
    .min(0)
    .describe('Number of GOV.UK Design System classes identified'),
  reusedClassCount: z
    .number()
    .int()
    .min(0)
    .describe('Number of existing app- classes reused'),
  newClassCount: z
    .number()
    .int()
    .min(0)
    .describe('Number of new app- classes required, each needing user approval'),
})

export const featureReviewStylingAgent = new Agent({
  id: 'feature-review-styling',
  name: 'Feature Review Styling',
  instructions: loadAgentInstructions('feature-review-styling', ['styling.md']),
  model: 'claude-haiku-4-5-20251001',
  tools: {},
})
