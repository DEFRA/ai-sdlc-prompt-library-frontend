import { homeViewModel } from '../../../../src/server/features/home/view-model.js'

describe('homeViewModel', () => {
  test('returns page title and three prompt cards', () => {
    const result = homeViewModel.get()

    expect(result.pageTitle).toBe('Defra AI Prompt Library')
    expect(result.promptCards).toHaveLength(3)
  })
})
