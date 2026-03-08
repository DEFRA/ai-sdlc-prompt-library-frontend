import { describe, test, expect } from 'vitest'
import { FeaturePlanInput, FeaturePlanOutput } from '../feature-plan-agent.js'

const exampleSpecOutput = {
  featureName: 'user-login',
  specificationPath: 'agent-logs/user-login/feature-specification.md',
  happyPaths: ['User signs in with valid credentials'],
  unhappyPaths: ['User enters wrong password'],
  edgeCases: ['User submits form with empty email'],
}

describe('feature-plan-agent', () => {
  describe('FeaturePlanInput schema', () => {
    test('accepts a feature specification and produces a structured implementation plan', () => {
      const input = FeaturePlanInput.safeParse(exampleSpecOutput)

      expect(input.success).toBe(true)
      if (input.success) {
        expect(input.data.featureName).toBe('user-login')
        expect(input.data.specificationPath).toContain('feature-specification.md')
      }
    })
  })

  describe('FeaturePlanOutput schema', () => {
    test('preserves all specification fields in the implementation plan output', () => {
      const output = FeaturePlanOutput.safeParse({
        featureName: 'user-login',
        planPath: 'agent-logs/user-login/implementation-plan.md',
        newFiles: [
          'services/ai-defra-search-frontend/src/server/login/controller.js',
          'services/ai-defra-search-frontend/tests/unit/server/login/controller.test.js',
        ],
        editedFiles: ['services/ai-defra-search-frontend/src/server/router.js'],
        testNames: [
          'renders the login page with a form',
          'redirects to dashboard when credentials are valid',
          'returns 401 when credentials are invalid',
        ],
      })

      expect(output.success).toBe(true)
      if (output.success) {
        expect(output.data.featureName).toBe('user-login')
        expect(output.data.planPath).toContain('implementation-plan.md')
        expect(output.data.newFiles.length).toBeGreaterThan(0)
        expect(output.data.testNames.length).toBeGreaterThan(0)
      }
    })
  })
})
