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

vi.mock('../../../../src/server/services/gallery/service.js', () => ({
  galleryService: {
    getAll: vi.fn(() => ALL_ENTRIES)
  }
}))

const { homeViewModel } =
  await import('../../../../src/server/features/home/view-model.js')

const { galleryService } =
  await import('../../../../src/server/services/gallery/service.js')

describe('#homeViewModel', () => {
  test('returns page title and gallery cards with title, type badge, summary, tags, and author', () => {
    const result = homeViewModel.get()

    expect(result.pageTitle).toBe('Defra AI Prompt Library')
    expect(result.galleryCards).toHaveLength(3)

    const promptCard = result.galleryCards.find(
      (c) => c.title === PROMPT_ENTRY.title
    )
    expect(promptCard.typeBadge).toBe('Prompt')
    expect(promptCard.summary).toBe(PROMPT_ENTRY.summary)
    expect(promptCard.author).toBe(PROMPT_ENTRY.author)
    expect(promptCard.tags).toEqual([
      ...PROMPT_ENTRY.useCaseTags,
      ...PROMPT_ENTRY.toolTags
    ])
    expect(promptCard.href).toBe(`/gallery/${PROMPT_ENTRY.id}`)

    const agentCard = result.galleryCards.find(
      (c) => c.title === AGENT_CONFIG_ENTRY.title
    )
    expect(agentCard.typeBadge).toBe('Agent Config')

    const workflowCard = result.galleryCards.find(
      (c) => c.title === WORKFLOW_ENTRY.title
    )
    expect(workflowCard.typeBadge).toBe('Workflow')
  })

  test('returns page title and empty cards array when no entries exist', () => {
    galleryService.getAll.mockReturnValueOnce([])

    const result = homeViewModel.get()

    expect(result.pageTitle).toBe('Defra AI Prompt Library')
    expect(result.galleryCards).toEqual([])
  })
})
