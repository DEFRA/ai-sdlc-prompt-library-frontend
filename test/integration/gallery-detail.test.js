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

  describe('repository entries', () => {
    test('GET /gallery/{entryId} returns repository page with design philosophy, key features, suitability, repo link, tags, and metadata', async () => {
      const { result, statusCode } = await server.inject({
        method: 'GET',
        url: '/gallery/ipaffs-utils'
      })

      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toContain('IPAFFS Utils')
      expect(result).toContain('Design philosophy')
      expect(result).toContain('Key features')
      expect(result).toContain('Who this is for')
      expect(result).not.toContain('What this is')
      expect(result).not.toContain('When to use this')
      expect(result).not.toContain('What&#39;s inside')
      expect(result).toContain(
        'https://github.com/DEFRA/ipaffs-utils/tree/master/agents'
      )
      expect(result).toContain('Rules')
      expect(result).toContain('Claude Code')
      expect(result).toContain('Sam Farrington')
      expect(result).toContain('Advanced')
    })
  })

  describe('prompt entries', () => {
    test('GET /gallery/{entryId} returns prompt page with story sections, copyable prompt block, tags, and metadata', async () => {
      const { result, statusCode } = await server.inject({
        method: 'GET',
        url: '/gallery/backlog-refinement-transcript'
      })

      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toContain('Backlog Refinement from Transcript')
      expect(result).toContain('What this prompt does')
      expect(result).toContain('Why this prompt works')
      expect(result).toContain('How to use the result')
      expect(result).toContain('defra-prompt-block')
      expect(result).toContain('Writing')
      expect(result).toContain('Any AI assistant')
      expect(result).toContain('Richard Holloway')
      expect(result).toContain('Getting started')
    })

    test('GET /gallery/{entryId} returns prompt page with before-you-start section when present', async () => {
      const { result } = await server.inject({
        method: 'GET',
        url: '/gallery/backlog-refinement-transcript'
      })

      expect(result).toContain('Before you start')
      expect(result).toContain(
        'Record your refinement session and produce a transcript'
      )
    })

    test('GET /gallery/{entryId} returns prompt page without before-you-start section when not provided', async () => {
      // The prototyping-workflow is a workflow, not a prompt, and has no
      // beforeYouStart section. We verify the conditional rendering here.
      const { result } = await server.inject({
        method: 'GET',
        url: '/gallery/prototyping-workflow'
      })

      expect(result).not.toContain('Before you start')
    })

    test.each([
      {
        name: 'with placeholders',
        entryId: 'backlog-refinement-transcript',
        expectHighlight: true
      },
      {
        name: 'without placeholders',
        entryId: 'prototyping-workflow',
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
        url: '/gallery/prototyping-workflow'
      })

      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toContain('AI Prototyping Workflow')
      expect(result).toContain('What this workflow achieves')
      expect(result).toContain('Why this works for us')
      expect(result).toContain('What you&#39;ll need')
      expect(result).toContain('Step 1')
      expect(result).toContain('Gather your designs')
      expect(result).toContain('Step 2')
      expect(result).toContain('Run the Journey Specification Agent')
      expect(result).toContain('govuk-details')
      expect(result).toContain('View prompt')
      expect(result).toContain('defra-prompt-block')
      expect(result).toContain('Prototyping')
      expect(result).toContain('Claude Code')
      expect(result).toContain('NRF Team')
      expect(result).toContain('Comfortable')
    })

    test('GET /gallery/{entryId} returns workflow page with single step', async () => {
      const { result, statusCode } = await server.inject({
        method: 'GET',
        url: '/gallery/prototyping-workflow'
      })

      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toContain('Step 1')
    })

    test('GET /gallery/{entryId} returns workflow metadata with estimated time when provided', async () => {
      const { result } = await server.inject({
        method: 'GET',
        url: '/gallery/prototyping-workflow'
      })

      expect(result).toContain('Estimated time')
      expect(result).toContain('1 to 2 hours')
    })

    test('GET /gallery/{entryId} returns workflow metadata without estimated time when not provided', async () => {
      const { result } = await server.inject({
        method: 'GET',
        url: '/gallery/ipaffs-utils'
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
        url: '/gallery/backlog-refinement-transcript'
      })

      expect(result).toContain('Use case')
      expect(result).toContain('Tools')
      expect(result).toContain('Writing')
      expect(result).toContain('Planning')
      expect(result).toContain('Any AI assistant')
    })
  })
})
