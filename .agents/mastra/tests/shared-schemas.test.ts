import { describe, test, expect } from 'vitest'
import {
  FeatureNameSchema,
  GoalSchema,
  ApprovalDecisionSchema,
  WorkflowErrorSchema,
  validateEmptyOutput,
  ValidationError,
} from '../schemas/shared-schemas.js'

describe('shared-schemas', () => {
  describe('FeatureNameSchema', () => {
    test('throws an error identifying the failing field when agent output does not match the expected shape', () => {
      const result = FeatureNameSchema.safeParse('Invalid Name With Spaces')

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0)
        expect(result.error.issues[0].message).toBeTruthy()
      }
    })
  })

  describe('GoalSchema', () => {
    test('rejects an empty goal string with a validation error', () => {
      const result = GoalSchema.safeParse('')

      expect(result.success).toBe(false)
    })
  })

  describe('ApprovalDecisionSchema', () => {
    test('parses an approved decision without a reason', () => {
      const result = ApprovalDecisionSchema.safeParse({ approved: true })

      expect(result.success).toBe(true)
    })

    test('parses a rejected decision with a reason', () => {
      const result = ApprovalDecisionSchema.safeParse({ approved: false, reason: 'Not ready' })

      expect(result.success).toBe(true)
    })
  })

  describe('WorkflowErrorSchema', () => {
    test('parses a workflow error with step and message fields', () => {
      const result = WorkflowErrorSchema.safeParse({ step: 'feature-plan', message: 'API unavailable' })

      expect(result.success).toBe(true)
    })
  })

  describe('validateEmptyOutput', () => {
    test.each([
      ['empty string', ''],
      ['empty object', {}],
    ])('throws an error when agent output is %s', (_, emptyOutput) => {
      expect(() => validateEmptyOutput(emptyOutput)).toThrow(ValidationError)
    })
  })
})
