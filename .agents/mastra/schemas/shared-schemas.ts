import { z } from 'zod'

export const FeatureNameSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9-]+$/)
  .describe('Kebab-case name for the feature, used as the agent-logs subdirectory')

export const GoalSchema = z
  .string()
  .min(1)
  .describe('The high-level goal submitted by the developer or automated system')

export const ApprovalDecisionSchema = z
  .object({
    approved: z.boolean().describe('Whether the human approved the suspended workflow state'),
    reason: z
      .string()
      .optional()
      .describe('Optional human-provided reason for approval or rejection'),
  })
  .describe('The decision made by a human at an approval checkpoint')

export const WorkflowErrorSchema = z
  .object({
    step: z.string().describe('The workflow step at which the error occurred'),
    message: z.string().describe('The error message'),
    context: z
      .record(z.unknown())
      .optional()
      .describe('Additional context captured at the point of failure'),
  })
  .describe('A structured error produced when a workflow step fails')

export type FeatureName = z.infer<typeof FeatureNameSchema>
export type Goal = z.infer<typeof GoalSchema>
export type ApprovalDecision = z.infer<typeof ApprovalDecisionSchema>
export type WorkflowError = z.infer<typeof WorkflowErrorSchema>

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export function validateEmptyOutput(output: unknown): void {
  if (output === '' || output === null || output === undefined) {
    throw new ValidationError(
      'Agent produced empty output: expected a non-empty string or object'
    )
  }

  if (typeof output === 'object' && !Array.isArray(output) && Object.keys(output as object).length === 0) {
    throw new ValidationError(
      'Agent produced empty output: expected a non-empty object with at least one field'
    )
  }
}
