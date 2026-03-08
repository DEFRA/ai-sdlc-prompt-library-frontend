const PROMPT_CARDS = [
  { title: 'Prompt one' },
  { title: 'Prompt two' },
  { title: 'Prompt three' }
]

export const homeViewModel = {
  get() {
    return {
      pageTitle: 'Defra AI Prompt Library',
      promptCards: PROMPT_CARDS
    }
  }
}
