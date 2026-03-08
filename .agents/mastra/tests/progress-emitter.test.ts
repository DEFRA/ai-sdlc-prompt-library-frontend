import { describe, test, expect } from 'vitest'
import { emitStepStart, emitStepComplete, runWithStream } from '../progress-emitter.js'

describe('progress-emitter', () => {
  describe('emitStepStart', () => {
    test('emits a started event when an agent step begins', () => {
      const event = emitStepStart('feature-spec')

      expect(event).toMatchObject({
        agent: 'feature-spec',
        status: 'started',
      })
      expect(event.timestamp).toBeTruthy()
      expect(new Date(event.timestamp).toISOString()).toBe(event.timestamp)
    })
  })

  describe('emitStepComplete', () => {
    test('emits a completed event with the agent output when an agent step finishes', () => {
      const output = { featureName: 'user-login', specificationPath: 'agent-logs/user-login/feature-specification.md' }

      const event = emitStepComplete('feature-spec', output)

      expect(event).toMatchObject({
        agent: 'feature-spec',
        status: 'completed',
        output,
      })
      expect(event.timestamp).toBeTruthy()
    })
  })

  describe('runWithStream', () => {
    test('yields events in the order that steps execute', async () => {
      const agentSequence = ['feature-spec', 'feature-plan', 'feature-write']
      const collectedEvents: Array<{ agent: string; status: string }> = []

      async function fakeExecute(
        _goal: string,
        onStepStart: (agent: string) => void,
        onStepComplete: (agent: string, output: unknown) => void
      ): Promise<void> {
        for (const agent of agentSequence) {
          onStepStart(agent)
          onStepComplete(agent, { result: `output-from-${agent}` })
        }
      }

      const stream = runWithStream('build a login page', fakeExecute)

      for await (const event of stream) {
        collectedEvents.push({ agent: event.agent, status: event.status })
      }

      expect(collectedEvents).toEqual([
        { agent: 'feature-spec', status: 'started' },
        { agent: 'feature-spec', status: 'completed' },
        { agent: 'feature-plan', status: 'started' },
        { agent: 'feature-plan', status: 'completed' },
        { agent: 'feature-write', status: 'started' },
        { agent: 'feature-write', status: 'completed' },
      ])
    })
  })
})
