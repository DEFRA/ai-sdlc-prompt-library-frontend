import { vi } from 'vitest'

import {
  buildAgentConfigEntry,
  buildPromptEntry,
  buildWorkflowEntry
} from '../../../../src/server/common/test-helpers/gallery-entry.factory.js'

const AGENT_CONFIG_ENTRY = buildAgentConfigEntry()
const PROMPT_ENTRY = buildPromptEntry()
const WORKFLOW_ENTRY = buildWorkflowEntry()
const ALL_ENTRIES = [AGENT_CONFIG_ENTRY, PROMPT_ENTRY, WORKFLOW_ENTRY]

const mockData = ALL_ENTRIES

vi.mock('node:fs', () => ({
  readFileSync: () => JSON.stringify(mockData)
}))

const { galleryService } =
  await import('../../../../src/server/services/gallery/service.js')

describe('#galleryService', () => {
  describe('getAll', () => {
    test('returns all published entries', () => {
      const result = galleryService.getAll()

      expect(result).toHaveLength(3)
      expect(result).toEqual(ALL_ENTRIES)
    })
  })

  describe('getById', () => {
    test('returns the entry matching the given id', () => {
      const result = galleryService.getById(PROMPT_ENTRY.id)

      expect(result).toEqual(PROMPT_ENTRY)
    })

    test('returns null when no entry matches the given id', () => {
      const result = galleryService.getById('non-existent-id')

      expect(result).toBeNull()
    })
  })
})
