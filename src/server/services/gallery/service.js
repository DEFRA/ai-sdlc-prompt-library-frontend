import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const dataPath = join(
  dirname(fileURLToPath(import.meta.url)),
  'data',
  'entries.json'
)
const entries = JSON.parse(readFileSync(dataPath, 'utf8'))

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
