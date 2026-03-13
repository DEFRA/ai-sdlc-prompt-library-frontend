function initCopyButtons() {
  const buttons = document.querySelectorAll('[data-copy-target]')

  buttons.forEach((button) => {
    button.removeAttribute('hidden')

    button.addEventListener('click', async () => {
      const promptBlock = button.closest('.defra-prompt-block')
      const codeElement = promptBlock?.querySelector('code')
      const statusElement = promptBlock?.querySelector(
        '.defra-prompt-block__status'
      )

      if (!codeElement) {
        return
      }

      try {
        await navigator.clipboard.writeText(codeElement.textContent)
        button.classList.add('defra-prompt-block__copy--success')
        button.textContent = 'Copied'

        if (statusElement) {
          statusElement.textContent = 'Prompt copied'
        }
      } catch {
        button.classList.add('defra-prompt-block__copy--error')
        button.textContent = 'Failed'

        if (statusElement) {
          statusElement.textContent = 'Copy failed'
        }
      }

      setTimeout(() => {
        button.classList.remove(
          'defra-prompt-block__copy--success',
          'defra-prompt-block__copy--error'
        )
        button.textContent = 'Copy'

        if (statusElement) {
          statusElement.textContent = ''
        }
      }, 2000)
    })
  })
}

initCopyButtons()
