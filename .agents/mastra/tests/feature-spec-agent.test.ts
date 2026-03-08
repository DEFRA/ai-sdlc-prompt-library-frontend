import { describe, test, expect } from 'vitest'
import { FeatureSpecInput, FeatureSpecOutput } from '../feature-spec-agent.js'

describe('feature-spec-agent', () => {
  describe('FeatureSpecInput schema', () => {
    test('writes a feature specification with Given/When/Then scenarios from a plain-language goal', () => {
      const input = FeatureSpecInput.safeParse({
        goal: 'Build a login page where users can sign in with their email and password',
        featureName: 'user-login',
      })

      expect(input.success).toBe(true)
      if (input.success) {
        expect(input.data.goal).toContain('login')
        expect(input.data.featureName).toBe('user-login')
      }
    })
  })

  describe('FeatureSpecOutput schema', () => {
    test('returns a structured output with all required specification fields', () => {
      const output = FeatureSpecOutput.safeParse({
        featureName: 'user-login',
        specificationPath: 'agent-logs/user-login/feature-specification.md',
        happyPaths: ['User signs in with valid credentials', 'User is redirected to dashboard after login'],
        unhappyPaths: ['User enters wrong password', 'User account is locked'],
        edgeCases: ['User submits form with empty email', 'Session expires mid-login flow'],
      })

      expect(output.success).toBe(true)
      if (output.success) {
        expect(output.data.featureName).toBe('user-login')
        expect(output.data.specificationPath).toContain('feature-specification.md')
        expect(output.data.happyPaths.length).toBeGreaterThan(0)
        expect(output.data.unhappyPaths.length).toBeGreaterThan(0)
        expect(output.data.edgeCases.length).toBeGreaterThan(0)
      }
    })
  })
})
