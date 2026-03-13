import {
  buildAgentConfigEntry,
  buildPromptEntry,
  buildWorkflowEntry
} from '../../../../src/server/common/test-helpers/gallery-entry.factory.js'

import { galleryDetailViewModel } from '../../../../src/server/features/gallery-detail/view-model.js'

const AGENT_CONFIG_ENTRY = buildAgentConfigEntry()
const PROMPT_ENTRY = buildPromptEntry()
const PROMPT_ENTRY_WITH_BEFORE_YOU_START = buildPromptEntry({
  beforeYouStart: ['Have the transcript ready', 'Know who attended']
})
const PROMPT_ENTRY_WITHOUT_BEFORE_YOU_START = buildPromptEntry({
  beforeYouStart: null
})
const WORKFLOW_ENTRY = buildWorkflowEntry()
const WORKFLOW_ENTRY_WITH_ESTIMATED_TIME = buildWorkflowEntry({
  estimatedTime: '45 minutes'
})
const WORKFLOW_ENTRY_WITHOUT_ESTIMATED_TIME = buildWorkflowEntry({
  estimatedTime: null
})
const SINGLE_STEP_WORKFLOW = buildWorkflowEntry({
  steps: [
    {
      title: 'Only step',
      context: 'This is the only step.',
      promptText: 'Do the thing with [INPUT]',
      whatToDoWithOutput: 'Review and use.'
    }
  ]
})

describe('#galleryDetailViewModel', () => {
  describe('agent-config entries', () => {
    test('returns page title, about sections, repository link, tags, and metadata', () => {
      const result = galleryDetailViewModel.get(AGENT_CONFIG_ENTRY)

      expect(result.pageTitle).toBe(AGENT_CONFIG_ENTRY.title)
      expect(result.entry.whatThisIs).toBe(AGENT_CONFIG_ENTRY.whatThisIs)
      expect(result.entry.whenToUseThis).toBe(AGENT_CONFIG_ENTRY.whenToUseThis)
      expect(result.entry.whatsInside).toBe(AGENT_CONFIG_ENTRY.whatsInside)
      expect(result.entry.repositoryUrl).toBe(AGENT_CONFIG_ENTRY.repositoryUrl)
      expect(result.tagGroups).toEqual([
        { label: 'Content', tags: AGENT_CONFIG_ENTRY.contentTags },
        { label: 'Tools', tags: AGENT_CONFIG_ENTRY.toolTags }
      ])
      expect(result.metadata.author).toBe(AGENT_CONFIG_ENTRY.author)
      expect(result.metadata.published).toBe(AGENT_CONFIG_ENTRY.published)
      expect(result.metadata.experienceLevel).toBe(
        AGENT_CONFIG_ENTRY.experienceLevel
      )
    })
  })

  describe('prompt entries', () => {
    test('returns page title, story sections, prompt text, tags, and metadata', () => {
      const result = galleryDetailViewModel.get(PROMPT_ENTRY)

      expect(result.pageTitle).toBe(PROMPT_ENTRY.title)
      expect(result.entry.whatThisPromptDoes).toBe(
        PROMPT_ENTRY.whatThisPromptDoes
      )
      expect(result.entry.whyThisPromptWorks).toBe(
        PROMPT_ENTRY.whyThisPromptWorks
      )
      expect(result.entry.howToUseTheResult).toBe(
        PROMPT_ENTRY.howToUseTheResult
      )
      expect(result.entry.promptText).toBe(PROMPT_ENTRY.promptText)
      expect(result.tagGroups).toEqual([
        { label: 'Use case', tags: PROMPT_ENTRY.useCaseTags },
        { label: 'Tools', tags: PROMPT_ENTRY.toolTags }
      ])
      expect(result.metadata.author).toBe(PROMPT_ENTRY.author)
    })

    test('includes before-you-start items when present', () => {
      const result = galleryDetailViewModel.get(
        PROMPT_ENTRY_WITH_BEFORE_YOU_START
      )

      expect(result.entry.beforeYouStart).toEqual([
        'Have the transcript ready',
        'Know who attended'
      ])
    })

    test('omits before-you-start section when not provided', () => {
      const result = galleryDetailViewModel.get(
        PROMPT_ENTRY_WITHOUT_BEFORE_YOU_START
      )

      expect(result.entry.beforeYouStart).toBeNull()
    })
  })

  describe('workflow entries', () => {
    test('returns page title, story sections, numbered steps with prompt text, tags, and metadata', () => {
      const result = galleryDetailViewModel.get(WORKFLOW_ENTRY)

      expect(result.pageTitle).toBe(WORKFLOW_ENTRY.title)
      expect(result.entry.whatThisWorkflowAchieves).toBe(
        WORKFLOW_ENTRY.whatThisWorkflowAchieves
      )
      expect(result.entry.whyThisWorkflowMatters).toBe(
        WORKFLOW_ENTRY.whyThisWorkflowMatters
      )
      expect(result.entry.whatYoullNeed).toEqual(WORKFLOW_ENTRY.whatYoullNeed)
      expect(result.entry.steps).toHaveLength(2)
      expect(result.entry.steps[0].number).toBe(1)
      expect(result.entry.steps[0].title).toBe(WORKFLOW_ENTRY.steps[0].title)
      expect(result.entry.steps[0].promptText).toBe(
        WORKFLOW_ENTRY.steps[0].promptText
      )
      expect(result.tagGroups).toEqual([
        { label: 'Use case', tags: WORKFLOW_ENTRY.useCaseTags },
        { label: 'Tools', tags: WORKFLOW_ENTRY.toolTags }
      ])
    })

    test('includes estimated time in metadata when provided', () => {
      const result = galleryDetailViewModel.get(
        WORKFLOW_ENTRY_WITH_ESTIMATED_TIME
      )

      expect(result.metadata.estimatedTime).toBe('45 minutes')
    })

    test('omits estimated time from metadata when not provided', () => {
      const result = galleryDetailViewModel.get(
        WORKFLOW_ENTRY_WITHOUT_ESTIMATED_TIME
      )

      expect(result.metadata.estimatedTime).toBeNull()
    })

    test('returns a single numbered step when workflow has one step', () => {
      const result = galleryDetailViewModel.get(SINGLE_STEP_WORKFLOW)

      expect(result.entry.steps).toHaveLength(1)
      expect(result.entry.steps[0].number).toBe(1)
      expect(result.entry.steps[0].title).toBe('Only step')
    })
  })
})
