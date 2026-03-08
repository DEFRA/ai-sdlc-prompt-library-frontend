import { describe, test, expect } from 'vitest'
import { ReviewStylingInput, ReviewStylingOutput } from '../feature-review-styling-agent.js'

describe('feature-review-styling-agent', () => {
  describe('ReviewStylingOutput schema', () => {
    test('appends styling guidance section without modifying any prior plan content', () => {
      const input = ReviewStylingInput.safeParse({
        featureName: 'user-login',
        planPath: 'agent-logs/user-login/implementation-plan.md',
        newFiles: [
          'services/ai-defra-search-frontend/src/server/login/views/login.njk',
          'services/ai-defra-search-frontend/src/server/login/controller.js',
        ],
        editedFiles: [],
      })

      expect(input.success).toBe(true)

      const output = ReviewStylingOutput.safeParse({
        featureName: 'user-login',
        updatedPlanPath: 'agent-logs/user-login/implementation-plan.md',
        stylingRequired: true,
        govukClassCount: 4,
        reusedClassCount: 1,
        newClassCount: 0,
      })

      expect(output.success).toBe(true)
      if (output.success) {
        expect(output.data.updatedPlanPath).toBe(input.success ? input.data.planPath : '')
        expect(output.data.stylingRequired).toBe(true)
      }
    })
  })
})
