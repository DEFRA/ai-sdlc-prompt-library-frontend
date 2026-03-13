import { createServer } from '../../src/server/server.js'
import { statusCodes } from '../../src/server/common/constants/status-codes.js'

describe('#homeController', () => {
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  test('GET / returns gallery introduction and entry cards with type badges', async () => {
    const { result, statusCode } = await server.inject({
      method: 'GET',
      url: '/'
    })

    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toContain('Defra AI Prompt Library')
    expect(result).toContain('User Story Generator')
    expect(result).toContain('Sprint Planning Pipeline')
    expect(result).toContain('Defra AI Coding Standards')
    expect(result).toContain('Prompt')
    expect(result).toContain('Workflow')
    expect(result).toContain('Agent Config')
  })
})
