import { Agent } from '@mastra/core'
import { z } from 'zod'
import { loadAgentInstructions } from './skill-loader.js'

export const ReviewCodeInput = z.object({
  featureName: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .describe('Kebab-case name for the feature'),
  implementedFiles: z
    .array(z.string())
    .describe('Paths of all files created or modified during implementation'),
  auditLogPath: z
    .string()
    .describe('Path to append findings to, e.g. agent-logs/<feature-name>/code-review.md'),
})

export const ReviewCodeOutput = z.object({
  featureName: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .describe('Kebab-case name for the feature'),
  auditLogPath: z
    .string()
    .describe('Path of the written audit log file'),
  criticalFindingsCount: z
    .number()
    .int()
    .min(0)
    .describe('Number of Critical findings — must be zero before committing'),
  suggestionCount: z
    .number()
    .int()
    .min(0)
    .describe('Number of Suggestion findings'),
  clearedToCommit: z
    .boolean()
    .describe('True when there are no Critical findings'),
})

export const featureReviewCodeAgent = new Agent({
  id: 'feature-review-code',
  name: 'Feature Review — Code',
  instructions: loadAgentInstructions('feature-review-code', [
    'server-architecture.md',
    'code-style.md',
    'testing.md',
    'styling.md',
  ]),
  model: 'claude-sonnet-4-6',
  tools: {},
})
