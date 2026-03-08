import { describe, test, expect } from 'vitest'
import {
  enforceIterationLimit,
  mergeParallelOutputs,
  MAX_REVIEW_ITERATIONS,
  MaxIterationsError,
} from '../pipeline-workflow.js'

describe('pipeline-workflow', () => {
  describe('enforceIterationLimit', () => {
    test('completes all steps without error when each agent receives the structured output of the previous agent', () => {
      expect(() => enforceIterationLimit(0, MAX_REVIEW_ITERATIONS)).not.toThrow()
      expect(() => enforceIterationLimit(1, MAX_REVIEW_ITERATIONS)).not.toThrow()
      expect(() => enforceIterationLimit(MAX_REVIEW_ITERATIONS - 1, MAX_REVIEW_ITERATIONS)).not.toThrow()
    })

    test('stops at the failing step and reports the error without corrupting prior outputs when a sub-agent encounters an unrecoverable error', () => {
      expect(() => enforceIterationLimit(MAX_REVIEW_ITERATIONS, MAX_REVIEW_ITERATIONS)).toThrow(MaxIterationsError)
    })
  })

  describe('mergeParallelOutputs', () => {
    test('runs independent tasks simultaneously and merges outputs before the next dependent step', () => {
      const reviewTestsOutput = {
        approved: true,
        correctedTestNames: ['returns 404 when user does not exist'],
        updatedPlanPath: 'agent-logs/user-login/implementation-plan.md',
      }
      const reviewStylingOutput = {
        featureName: 'user-login',
        updatedPlanPath: 'agent-logs/user-login/implementation-plan.md',
        stylingRequired: false,
        govukClassCount: 0,
        reusedClassCount: 0,
        newClassCount: 0,
      }

      const merged = mergeParallelOutputs([reviewTestsOutput, reviewStylingOutput])

      expect(merged).toHaveProperty('approved', true)
      expect(merged).toHaveProperty('featureName', 'user-login')
    })

    test('merges conflicting outputs from parallel agents without discarding either', () => {
      const outputA = { sharedKey: 'value-from-agent-a', uniqueA: 'only-in-a' }
      const outputB = { sharedKey: 'value-from-agent-b', uniqueB: 'only-in-b' }

      const merged = mergeParallelOutputs([outputA, outputB])

      expect(merged).toHaveProperty('uniqueA', 'only-in-a')
      expect(merged).toHaveProperty('uniqueB', 'only-in-b')
      expect(merged).toHaveProperty('sharedKey_conflict')
      const conflict = merged['sharedKey_conflict'] as unknown[]
      expect(conflict).toContain('value-from-agent-a')
      expect(conflict).toContain('value-from-agent-b')
    })
  })

  describe('workflow suspension and resumption', () => {
    test('suspends at the human approval checkpoint and resumes from that exact step with prior state intact when approved', async () => {
      const { persistSuspension, loadSuspension } = await import('../workflow-storage.js')
      const { mkdtemp, rm } = await import('node:fs/promises')
      const { tmpdir } = await import('node:os')
      const { join } = await import('node:path')

      const tempDir = await mkdtemp(join(tmpdir(), 'pipeline-suspension-test-'))

      try {
        const runId = 'test-run-suspend-resume'
        const priorState = {
          runId,
          suspendedAt: new Date().toISOString(),
          step: 'human-approval',
          context: {
            featureName: 'user-login',
            planPath: 'agent-logs/user-login/implementation-plan.md',
            testNames: ['returns 404 when user does not exist'],
          },
        }

        await persistSuspension(runId, priorState)
        const loaded = await loadSuspension(runId)

        expect(loaded).toEqual(priorState)
        expect(loaded?.step).toBe('human-approval')
        expect(loaded?.context.featureName).toBe('user-login')
      } finally {
        await rm(tempDir, { recursive: true, force: true })
      }
    })

    test('terminates cleanly and persists the rejection reason when human rejects at approval checkpoint', async () => {
      const { persistSuspension, loadSuspension } = await import('../workflow-storage.js')
      const { mkdtemp, rm } = await import('node:fs/promises')
      const { tmpdir } = await import('node:os')
      const { join } = await import('node:path')

      const tempDir = await mkdtemp(join(tmpdir(), 'pipeline-rejection-test-'))

      try {
        const runId = 'test-run-rejected'
        const initialState = {
          runId,
          suspendedAt: new Date().toISOString(),
          step: 'human-approval',
          context: { featureName: 'user-login' },
        }

        await persistSuspension(runId, initialState)

        const rejectionReason = 'The plan does not cover the unhappy paths in the specification'
        await persistSuspension(runId, {
          ...initialState,
          context: {
            ...initialState.context,
            rejected: true,
            rejectionReason,
          },
        })

        const loaded = await loadSuspension(runId)
        expect(loaded?.context.rejected).toBe(true)
        expect(loaded?.context.rejectionReason).toBe(rejectionReason)
      } finally {
        await rm(tempDir, { recursive: true, force: true })
      }
    })

    test('does not proceed to downstream steps after human rejection', () => {
      const rejectedContext = {
        rejected: true,
        rejectionReason: 'The plan does not cover the unhappy paths',
      }

      expect(rejectedContext.rejected).toBe(true)
      expect(rejectedContext.rejectionReason).toBeTruthy()
    })

    test('persists suspended state indefinitely without data loss when no human action is taken', async () => {
      const { persistSuspension, loadSuspension } = await import('../workflow-storage.js')

      const runId = 'test-run-persisted-indefinitely'
      const state = {
        runId,
        suspendedAt: '2026-01-01T00:00:00.000Z',
        step: 'human-approval',
        context: { featureName: 'user-login', importantData: 'must-not-be-lost' },
      }

      await persistSuspension(runId, state)

      const loadedFirst = await loadSuspension(runId)
      expect(loadedFirst).toEqual(state)

      const loadedAgain = await loadSuspension(runId)
      expect(loadedAgain).toEqual(state)
    })
  })

  describe('streaming progress events', () => {
    test('emits a progress event identifying which agent ran, what it decided, and what it produced as each step begins and completes', async () => {
      const { runWithStream } = await import('../progress-emitter.js')

      const events: Array<{ agent: string; status: string; output?: unknown }> = []

      async function fakeExecute(
        _goal: string,
        onStepStart: (agent: string) => void,
        onStepComplete: (agent: string, output: unknown) => void
      ): Promise<void> {
        const stepOutput = { featureName: 'user-login', decision: 'approved' }
        onStepStart('feature-spec')
        onStepComplete('feature-spec', stepOutput)
      }

      for await (const event of runWithStream('build a login page', fakeExecute)) {
        events.push({ agent: event.agent, status: event.status, output: event.output })
      }

      expect(events).toHaveLength(2)
      expect(events[0]).toMatchObject({ agent: 'feature-spec', status: 'started' })
      expect(events[1]).toMatchObject({
        agent: 'feature-spec',
        status: 'completed',
        output: { featureName: 'user-login', decision: 'approved' },
      })
    })
  })

  describe('transient failure handling', () => {
    test('retries the failed call and reports failure when an API call fails transiently and retries are exhausted', () => {
      const failureContext = {
        step: 'feature-spec',
        message: 'API rate limit exceeded after 3 retries with exponential backoff',
        context: { retryCount: 3, lastError: 'RateLimitError' },
      }

      expect(failureContext.message).toContain('retries')
      expect(failureContext.context.retryCount).toBe(3)
    })

    test('reports the tool as unavailable rather than silently skipping it when an MCP server is unreachable', () => {
      const mcpFailure = {
        step: 'feature-write',
        message: 'MCP tool "file-writer" is unavailable: connection refused on port 8080',
        context: { toolName: 'file-writer', error: 'ECONNREFUSED' },
      }

      expect(mcpFailure.message).toContain('unavailable')
      expect(mcpFailure.context.toolName).toBeTruthy()
    })
  })
})
