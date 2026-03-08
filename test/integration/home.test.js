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

  test('GET / returns homepage with prompt library title and three cards', async () => {
    const { result, statusCode } = await server.inject({
      method: 'GET',
      url: '/'
    })

    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toContain('Defra AI Prompt Library')
    expect(result).toContain('Prompt one')
    expect(result).toContain('Prompt two')
    expect(result).toContain('Prompt three')
  })
})
