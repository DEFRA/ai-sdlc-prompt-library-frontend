import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const dataDir = join(dirname(fileURLToPath(import.meta.url)), 'data')
const promptsDir = join(dataDir, 'prompts')

function hydratePromptFiles(entries) {
  return entries.map((entry) => {
    if (!entry.steps) return entry

    return {
      ...entry,
      steps: entry.steps.map((step) => {
        if (!step.promptFile) return step

        const { promptFile, ...rest } = step
        return {
          ...rest,
          promptText: readFileSync(join(promptsDir, promptFile), 'utf8')
        }
      })
    }
  })
}

const entries = hydratePromptFiles(
  JSON.parse(readFileSync(join(dataDir, 'entries.json'), 'utf8'))
)

function getEntries() {
  return entries
}

export const galleryService = {
  getAll() {
    return getEntries()
  },

  getById(id) {
    const entry = getEntries().find((e) => e.id === id)
    return entry ?? null
  }
}
