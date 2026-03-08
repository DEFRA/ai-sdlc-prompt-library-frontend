import { Agent } from '@mastra/core'
import { z } from 'zod'
import { loadAgentInstructions } from './skill-loader.js'

export const FeatureWriteInput = z.object({
  featureName: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .describe('Kebab-case name for the feature'),
  specificationPath: z
    .string()
    .describe('Relative path to the feature-specification.md file'),
  planPath: z
    .string()
    .describe('Relative path to the implementation-plan.md file, including styling guidance'),
  testNames: z
    .array(z.string())
    .describe('Exact test names as they must appear in the written test files'),
  reviewDecisions: z
    .object({
      testNamesApproved: z.boolean().describe('Whether the test names were approved by feature-review-tests'),
      stylingRequired: z.boolean().describe('Whether styling guidance was produced by feature-review-styling'),
    })
    .describe('Decisions from the review agents that inform the implementation'),
  iterationCount: z
    .number()
    .int()
    .min(0)
    .describe('Number of implementation iterations completed so far'),
  testFailureDetails: z
    .string()
    .optional()
    .describe('Details of failing tests from the previous iteration, if any'),
})

export const FeatureWriteOutput = z.object({
  featureName: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .describe('Kebab-case name for the feature'),
  implementedFiles: z
    .array(z.string())
    .describe('Paths of all files created or modified during implementation'),
  testsPassed: z.boolean().describe('Whether all tests passed after implementation'),
  testFailureDetails: z
    .string()
    .optional()
    .describe('Details of failing tests, populated only when testsPassed is false'),
})

export const featureWriteAgent = new Agent({
  id: 'feature-write',
  name: 'Feature Write',
  instructions: loadAgentInstructions('feature-write', ['server-architecture.md', 'testing.md', 'styling.md', 'code-style.md']),
  model: 'claude-sonnet-4-6',
  tools: {},
})
