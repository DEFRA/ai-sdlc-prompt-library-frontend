import { vi } from 'vitest'

import {
  buildRepositoryEntry,
  buildPromptEntry,
  buildWorkflowEntry
} from '../../../../src/server/common/test-helpers/gallery-entry.factory.js'

const REPOSITORY_ENTRY = buildRepositoryEntry()
const PROMPT_ENTRY = buildPromptEntry()
const WORKFLOW_ENTRY = buildWorkflowEntry()
const ALL_ENTRIES = [REPOSITORY_ENTRY, PROMPT_ENTRY, WORKFLOW_ENTRY]

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
  test('returns page title and gallery cards with title, type badge, summary, and tags', () => {
    const result = homeViewModel.get()

    expect(result.pageTitle).toBe('Defra AI Prompt Library')
    expect(result.galleryCards).toHaveLength(3)

    const promptCard = result.galleryCards.find(
      (c) => c.title === PROMPT_ENTRY.title
    )
    expect(promptCard.typeBadge).toBe('Prompt')
    expect(promptCard.summary).toBe(PROMPT_ENTRY.summary)
    expect(promptCard.tags).toEqual([
      ...PROMPT_ENTRY.useCaseTags,
      ...PROMPT_ENTRY.toolTags
    ])
    expect(promptCard.href).toBe(`/gallery/${PROMPT_ENTRY.id}`)

    const repositoryCard = result.galleryCards.find(
      (c) => c.title === REPOSITORY_ENTRY.title
    )
    expect(repositoryCard.typeBadge).toBe('Repository')

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
