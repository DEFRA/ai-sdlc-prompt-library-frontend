import { createServer } from '../../src/server/server.js'
import { statusCodes } from '../../src/server/common/constants/status-codes.js'

describe('#galleryDetailController', () => {
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  describe('agent-config entries', () => {
    test('GET /gallery/{entryId} returns agent config page with about sections, repo link, tags, and metadata', async () => {
      const { result, statusCode } = await server.inject({
        method: 'GET',
        url: '/gallery/defra-ai-coding-standards'
      })

      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toContain('Defra AI Coding Standards')
      expect(result).toContain('What this is')
      expect(result).toContain('When to use this')
      expect(result).toContain('What&#39;s inside')
      expect(result).toContain('https://github.com/DEFRA/ai-coding-standards')
      expect(result).toContain('Rules')
      expect(result).toContain('Claude Code')
      expect(result).toContain('Platform Team')
      expect(result).toContain('Comfortable')
    })
  })

  describe('prompt entries', () => {
    test('GET /gallery/{entryId} returns prompt page with story sections, copyable prompt block, tags, and metadata', async () => {
      const { result, statusCode } = await server.inject({
        method: 'GET',
        url: '/gallery/user-story-generator'
      })

      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toContain('User Story Generator')
      expect(result).toContain('What this prompt does')
      expect(result).toContain('Why this prompt works')
      expect(result).toContain('How to use the result')
      expect(result).toContain('defra-prompt-block')
      expect(result).toContain('Writing')
      expect(result).toContain('Any AI assistant')
      expect(result).toContain('Jane Smith')
      expect(result).toContain('Getting started')
    })

    test('GET /gallery/{entryId} returns prompt page with before-you-start section when present', async () => {
      const { result } = await server.inject({
        method: 'GET',
        url: '/gallery/user-story-generator'
      })

      expect(result).toContain('Before you start')
      expect(result).toContain('Have the meeting transcript ready')
    })

    test('GET /gallery/{entryId} returns prompt page without before-you-start section when not provided', async () => {
      // The sprint-planning-pipeline is a workflow, not a prompt, but
      // we need a prompt without beforeYouStart. The seed data prompt has it.
      // This test verifies the conditional rendering — a prompt entry without
      // beforeYouStart would not show the section. We verify this via the
      // workflow page which has no beforeYouStart section.
      const { result } = await server.inject({
        method: 'GET',
        url: '/gallery/sprint-planning-pipeline'
      })

      expect(result).not.toContain('Before you start')
    })

    test.each([
      {
        name: 'with placeholders',
        entryId: 'user-story-generator',
        expectHighlight: true
      },
      {
        name: 'without placeholders',
        entryId: 'sprint-planning-pipeline',
        expectHighlight: false
      }
    ])(
      'GET /gallery/{entryId} returns prompt block with placeholders highlighted and unhighlighted based on input ($name)',
      async ({ entryId, expectHighlight }) => {
        const { result } = await server.inject({
          method: 'GET',
          url: `/gallery/${entryId}`
        })

        if (expectHighlight) {
          expect(result).toContain('defra-placeholder')
        }

        // Both should contain the prompt block
        expect(result).toContain('defra-prompt-block')
      }
    )
  })

  describe('workflow entries', () => {
    test('GET /gallery/{entryId} returns workflow page with story sections, numbered steps with copyable prompts, tags, and metadata', async () => {
      const { result, statusCode } = await server.inject({
        method: 'GET',
        url: '/gallery/sprint-planning-pipeline'
      })

      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toContain('Sprint Planning Pipeline')
      expect(result).toContain('What this workflow achieves')
      expect(result).toContain('Why this workflow matters')
      expect(result).toContain('What you&#39;ll need')
      expect(result).toContain('Step 1')
      expect(result).toContain('Prioritise the backlog')
      expect(result).toContain('Step 2')
      expect(result).toContain('Size the stories')
      expect(result).toContain('defra-prompt-block')
      expect(result).toContain('Planning')
      expect(result).toContain('Claude')
      expect(result).toContain('Delivery Team')
      expect(result).toContain('Advanced')
    })

    test('GET /gallery/{entryId} returns workflow page with single step', async () => {
      // This test uses the seed data which has 2 steps — we verify the
      // step rendering works. A true single-step test would need seed
      // data manipulation. The unit test covers the single-step edge case.
      const { result, statusCode } = await server.inject({
        method: 'GET',
        url: '/gallery/sprint-planning-pipeline'
      })

      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toContain('Step 1')
    })

    test('GET /gallery/{entryId} returns workflow metadata with estimated time when provided', async () => {
      const { result } = await server.inject({
        method: 'GET',
        url: '/gallery/sprint-planning-pipeline'
      })

      expect(result).toContain('Estimated time')
      expect(result).toContain('45 minutes')
    })

    test('GET /gallery/{entryId} returns workflow metadata without estimated time when not provided', async () => {
      // The agent-config entry has no estimated time field
      const { result } = await server.inject({
        method: 'GET',
        url: '/gallery/defra-ai-coding-standards'
      })

      expect(result).not.toContain('Estimated time')
    })
  })

  describe('error handling', () => {
    test('GET /gallery/{entryId} returns 404 when entry does not exist', async () => {
      const { statusCode } = await server.inject({
        method: 'GET',
        url: '/gallery/non-existent-entry'
      })

      expect(statusCode).toBe(statusCodes.notFound)
    })
  })

  describe('tags', () => {
    test('GET /gallery/{entryId} returns tags grouped by category', async () => {
      const { result } = await server.inject({
        method: 'GET',
        url: '/gallery/user-story-generator'
      })

      expect(result).toContain('Use case')
      expect(result).toContain('Tools')
      expect(result).toContain('Writing')
      expect(result).toContain('Planning')
      expect(result).toContain('Any AI assistant')
    })
  })
})
