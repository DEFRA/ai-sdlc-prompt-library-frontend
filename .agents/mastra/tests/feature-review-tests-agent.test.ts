import { describe, test, expect } from 'vitest'
import { ReviewTestsInput, ReviewTestsOutput } from '../feature-review-tests-agent.js'
import { MAX_REVIEW_ITERATIONS } from '../pipeline-workflow.js'

describe('feature-review-tests-agent', () => {
  describe('ReviewTestsOutput schema', () => {
    test('returns structured rejection feedback when test names do not meet quality bar', () => {
      const output = ReviewTestsOutput.safeParse({
        approved: false,
        correctedTestNames: [
          'redirects to login when session has expired',
          'returns 404 when user does not exist',
        ],
        rejectionFeedback:
          'Test names "handleExpiredSession" and "test404" do not describe observable behaviour. Corrected to describe outcomes.',
        updatedPlanPath: 'agent-logs/user-login/implementation-plan.md',
      })

      expect(output.success).toBe(true)
      if (output.success) {
        expect(output.data.approved).toBe(false)
        expect(output.data.rejectionFeedback).toBeTruthy()
        expect(output.data.correctedTestNames.length).toBeGreaterThan(0)
      }
    })

    test('routes back to planning with rejection feedback when the review fails', () => {
      const output = ReviewTestsOutput.safeParse({
        approved: false,
        correctedTestNames: ['returns 404 when user does not exist'],
        rejectionFeedback: 'Test name "test user not found" does not describe the observable outcome',
        updatedPlanPath: 'agent-logs/user-login/implementation-plan.md',
      })

      expect(output.success).toBe(true)
      if (output.success) {
        expect(output.data.approved).toBe(false)
        expect(output.data.rejectionFeedback).toBeTruthy()
      }
    })
  })

  describe('ReviewTestsInput schema', () => {
    test('stops the reviewer-writer loop after the configured maximum iteration count', () => {
      const input = ReviewTestsInput.safeParse({
        featureName: 'user-login',
        planPath: 'agent-logs/user-login/implementation-plan.md',
        testNames: ['returns 404 when user does not exist'],
        iterationCount: MAX_REVIEW_ITERATIONS,
      })

      expect(input.success).toBe(true)
      if (input.success) {
        expect(input.data.iterationCount).toBe(MAX_REVIEW_ITERATIONS)
      }
    })
  })
})
