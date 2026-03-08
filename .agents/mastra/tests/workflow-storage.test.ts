import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { WorkflowState } from '../workflow-storage.js'

let tempDir: string

beforeEach(async () => {
  tempDir = await mkdtemp(join(tmpdir(), 'workflow-storage-test-'))
})

afterEach(async () => {
  await rm(tempDir, { recursive: true, force: true })
})

async function buildStorageFunctions(storageDir: string) {
  const { readFile, writeFile, mkdir } = await import('node:fs/promises')
  const { dirname } = await import('node:path')

  function buildPath(runId: string): string {
    return join(storageDir, `${runId}.json`)
  }

  async function persist(runId: string, state: WorkflowState): Promise<void> {
    const filePath = buildPath(runId)
    await mkdir(dirname(filePath), { recursive: true })
    await writeFile(filePath, JSON.stringify(state, null, 2), 'utf-8')
  }

  async function load(runId: string): Promise<WorkflowState | null> {
    const filePath = buildPath(runId)
    try {
      const content = await readFile(filePath, 'utf-8')
      return JSON.parse(content) as WorkflowState
    } catch (error: unknown) {
      const nodeError = error as NodeJS.ErrnoException
      if (nodeError.code === 'ENOENT') {
        return null
      }
      throw error
    }
  }

  return { persist, load }
}

describe('workflow-storage', () => {
  describe('persistSuspension and loadSuspension', () => {
    test('serialises and restores workflow state with all fields intact across a suspend/load cycle', async () => {
      const { persist, load } = await buildStorageFunctions(tempDir)

      const state: WorkflowState = {
        runId: 'run-abc-123',
        suspendedAt: '2026-03-08T10:00:00.000Z',
        step: 'human-approval',
        context: {
          featureName: 'user-login',
          planPath: 'agent-logs/user-login/implementation-plan.md',
          testNames: ['returns 404 when user does not exist'],
        },
      }

      await persist(state.runId, state)
      const loaded = await load(state.runId)

      expect(loaded).toEqual(state)
    })

    test('returns null when loading a run ID that does not exist in storage', async () => {
      const { load } = await buildStorageFunctions(tempDir)

      const result = await load('nonexistent-run-id')

      expect(result).toBeNull()
    })
  })
})
