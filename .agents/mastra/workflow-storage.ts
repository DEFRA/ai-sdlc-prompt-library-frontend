import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'

export interface WorkflowState {
  runId: string
  suspendedAt: string
  step: string
  context: Record<string, unknown>
}

const STORAGE_DIR = join(import.meta.dirname ?? '.', '.cache', 'workflow-suspensions')

function buildStoragePath(runId: string): string {
  return join(STORAGE_DIR, `${runId}.json`)
}

export async function persistSuspension(runId: string, state: WorkflowState): Promise<void> {
  const filePath = buildStoragePath(runId)
  await mkdir(dirname(filePath), { recursive: true })
  await writeFile(filePath, JSON.stringify(state, null, 2), 'utf-8')
}

export async function loadSuspension(runId: string): Promise<WorkflowState | null> {
  const filePath = buildStoragePath(runId)

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
