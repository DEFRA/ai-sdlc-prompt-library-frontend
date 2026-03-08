import { describe, test, expect } from 'vitest'
import { FeatureWriteInput, FeatureWriteOutput } from '../feature-write-agent.js'

describe('feature-write-agent', () => {
  describe('FeatureWriteInput schema', () => {
    test('uses the feature specification, implementation plan, and review decisions from earlier pipeline steps', () => {
      const input = FeatureWriteInput.safeParse({
        featureName: 'user-login',
        specificationPath: 'agent-logs/user-login/feature-specification.md',
        planPath: 'agent-logs/user-login/implementation-plan.md',
        testNames: [
          'renders the login page with a form',
          'redirects to dashboard when credentials are valid',
          'returns 401 when credentials are invalid',
        ],
        reviewDecisions: {
          testNamesApproved: true,
          stylingRequired: true,
        },
        iterationCount: 0,
      })

      expect(input.success).toBe(true)
      if (input.success) {
        expect(input.data.specificationPath).toContain('feature-specification.md')
        expect(input.data.planPath).toContain('implementation-plan.md')
        expect(input.data.reviewDecisions.testNamesApproved).toBe(true)
      }
    })
  })

  describe('FeatureWriteOutput schema', () => {
    test('returns to implementation with test failure details when tests fail', () => {
      const output = FeatureWriteOutput.safeParse({
        featureName: 'user-login',
        implementedFiles: [
          'services/ai-defra-search-frontend/src/server/login/controller.js',
          'services/ai-defra-search-frontend/tests/unit/server/login/controller.test.js',
        ],
        testsPassed: false,
        testFailureDetails:
          'AssertionError: expected h.view to be called with "login/login" but was called with "login/index"',
      })

      expect(output.success).toBe(true)
      if (output.success) {
        expect(output.data.testsPassed).toBe(false)
        expect(output.data.testFailureDetails).toBeTruthy()
      }
    })

    test('does not proceed to any downstream step when tests fail', () => {
      const output = FeatureWriteOutput.safeParse({
        featureName: 'user-login',
        implementedFiles: ['services/ai-defra-search-frontend/src/server/login/controller.js'],
        testsPassed: false,
        testFailureDetails: 'TypeError: Cannot read properties of undefined (reading "view")',
      })

      expect(output.success).toBe(true)
      if (output.success) {
        expect(output.data.testsPassed).toBe(false)
        expect(output.data.testFailureDetails).toBeTruthy()
      }
    })
  })
})
