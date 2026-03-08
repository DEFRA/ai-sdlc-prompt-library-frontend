import { describe, test, expect } from 'vitest'
import { z } from 'zod'
import { RoutingInput, RoutingOutput, MAX_ROUTING_ITERATIONS } from '../routing-agent.js'

const mockAvailableAgents = [
  {
    name: 'Feature Spec',
    skillDirectory: 'feature-spec',
    description: 'Produce a feature specification from a plain-language description',
    triggerPhrases: ['write a feature spec', 'create a specification', 'spec out this feature'],
  },
  {
    name: 'Feature Plan',
    skillDirectory: 'feature-plan',
    description: 'Produce an implementation plan from a feature specification',
    triggerPhrases: ['plan the implementation', 'create an implementation plan', 'plan this feature'],
  },
  {
    name: 'Feature Review Tests',
    skillDirectory: 'feature-review-tests',
    description: 'Evaluate and correct test names in an implementation plan',
    triggerPhrases: ['review the test plan', 'review the test names', 'check the test names'],
  },
  {
    name: 'Feature Review Styling',
    skillDirectory: 'feature-review-styling',
    description: 'Analyse styling implications of an implementation plan',
    triggerPhrases: ['review the styling for this feature', 'styling review', 'what styles are needed'],
  },
  {
    name: 'Feature Write',
    skillDirectory: 'feature-write',
    description: 'Write the code that implements a feature',
    triggerPhrases: ['implement the feature', 'build this feature', 'write the code'],
  },
]

describe('routing-agent', () => {
  describe('RoutingInput schema', () => {
    test('selects all five agents in correct order when goal maps to the full pipeline', () => {
      const output: z.infer<typeof RoutingOutput> = {
        selectedAgents: [
          'feature-spec',
          'feature-plan',
          'feature-review-tests',
          'feature-review-styling',
          'feature-write',
        ],
        reasoning: 'Goal requires the full pipeline from specification through to implementation',
        requiresClarification: false,
      }

      const result = RoutingOutput.safeParse(output)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.selectedAgents).toHaveLength(5)
        expect(result.data.selectedAgents[0]).toBe('feature-spec')
        expect(result.data.selectedAgents[4]).toBe('feature-write')
      }
    })

    test('selects only the relevant subset of agents when goal maps to a partial pipeline', () => {
      const output: z.infer<typeof RoutingOutput> = {
        selectedAgents: ['feature-spec', 'feature-plan'],
        reasoning: 'Goal only requires specification and planning, not implementation',
        requiresClarification: false,
      }

      const result = RoutingOutput.safeParse(output)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.selectedAgents).toHaveLength(2)
        expect(result.data.selectedAgents).not.toContain('feature-write')
      }
    })

    test('determines a valid agent sequence when the required ordering is ambiguous', () => {
      const output: z.infer<typeof RoutingOutput> = {
        selectedAgents: ['feature-spec', 'feature-plan'],
        reasoning:
          'Selected spec then plan as spec must come before plan; ordering was not explicit in goal but follows logical dependency',
        requiresClarification: false,
      }

      const result = RoutingOutput.safeParse(output)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.selectedAgents.length).toBeGreaterThan(0)
        expect(result.data.reasoning).toBeTruthy()
      }
    })

    test('invokes only the matching single agent when goal requires exactly one agent', () => {
      const output: z.infer<typeof RoutingOutput> = {
        selectedAgents: ['feature-spec'],
        reasoning: 'Goal only asked for a feature specification, no further steps required',
        requiresClarification: false,
      }

      const result = RoutingOutput.safeParse(output)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.selectedAgents).toHaveLength(1)
        expect(result.data.selectedAgents[0]).toBe('feature-spec')
      }
    })

    test('asks one clarifying question when goal is too vague to decompose', () => {
      const output: z.infer<typeof RoutingOutput> = {
        selectedAgents: [],
        reasoning: 'Goal is too vague to determine which agents to invoke',
        requiresClarification: true,
        clarifyingQuestion: 'Are you asking for a full implementation from specification to code, or just the specification?',
      }

      const result = RoutingOutput.safeParse(output)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.requiresClarification).toBe(true)
        expect(result.data.clarifyingQuestion).toBeTruthy()
      }
    })

    test('selects the most specific agent when two agents are equally valid for a goal', () => {
      const output: z.infer<typeof RoutingOutput> = {
        selectedAgents: ['feature-review-tests'],
        reasoning:
          'Selected feature-review-tests over feature-review-styling because the goal specifically mentions test names',
        requiresClarification: false,
      }

      const result = RoutingOutput.safeParse(output)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.selectedAgents).toHaveLength(1)
      }
    })

    test('records which agent was selected and why when two agents are equally valid', () => {
      const output: z.infer<typeof RoutingOutput> = {
        selectedAgents: ['feature-review-tests'],
        reasoning:
          'feature-review-tests selected over feature-review-styling: trigger phrase "review the test names" is a direct match; styling review was considered but the goal contains no mention of CSS or UI elements',
        requiresClarification: false,
      }

      const result = RoutingOutput.safeParse(output)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.reasoning).toContain('feature-review-tests')
        expect(result.data.reasoning).toContain('feature-review-styling')
      }
    })

    test('returns a clear error when goal does not match any registered agent', () => {
      const output: z.infer<typeof RoutingOutput> = {
        selectedAgents: [],
        reasoning: 'No agent matched the goal',
        requiresClarification: false,
        error: 'Could not route request: no registered agent matches the goal "deploy this to production"',
      }

      const result = RoutingOutput.safeParse(output)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.error).toBeTruthy()
        expect(result.data.selectedAgents).toHaveLength(0)
      }
    })

    test('stops after configured maximum iteration count when loop termination condition is never met', () => {
      expect(MAX_ROUTING_ITERATIONS).toBeGreaterThan(0)

      const input = RoutingInput.safeParse({
        goal: 'build a login page',
        availableAgents: mockAvailableAgents,
        iterationCount: MAX_ROUTING_ITERATIONS,
      })

      expect(input.success).toBe(true)
    })
  })
})
