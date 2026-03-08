import { Agent } from '@mastra/core'
import { z } from 'zod'
import { loadAgentInstructions } from './skill-loader.js'

export const ReviewTestsInput = z.object({
  featureName: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .describe('Kebab-case name for the feature'),
  planPath: z
    .string()
    .describe('Relative path to the implementation-plan.md file to be reviewed'),
  testNames: z
    .array(z.string())
    .describe('Exact test names from the plan to be evaluated'),
  iterationCount: z
    .number()
    .int()
    .min(0)
    .describe('Number of review iterations completed so far'),
})

export const ReviewTestsOutput = z.object({
  approved: z.boolean().describe('Whether the test names meet the quality bar'),
  correctedTestNames: z
    .array(z.string())
    .describe('Test names after correction; identical to input if approved'),
  rejectionFeedback: z
    .string()
    .optional()
    .describe('Structured feedback explaining why test names were rejected, if applicable'),
  updatedPlanPath: z
    .string()
    .describe('Relative path to the implementation-plan.md file, updated in place with corrected test names'),
})

export const featureReviewTestsAgent = new Agent({
  id: 'feature-review-tests',
  name: 'Feature Review Tests',
  instructions: loadAgentInstructions('feature-review-tests', ['testing.md']),
  model: 'claude-haiku-4-5-20251001',
  tools: {},
})
