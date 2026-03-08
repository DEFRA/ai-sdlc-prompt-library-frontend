export const homeViewModel = {
  get() {
    return {
      pageTitle: 'Home',
      version: '1.0.0',
      versionNote: 'This service is in active development. Features may change.',
      tiles: [
        {
          title: 'Prompt Templates',
          href: '/prompts',
          body: 'Browse and use pre-built prompt templates for common AI development tasks.'
        },
        {
          title: 'Guidelines',
          href: '/guidelines',
          body: 'Principles and standards for responsible AI use across Defra digital services.'
        },
        {
          title: 'Resources',
          href: '/resources',
          body: 'Tools, references, and further reading for AI-assisted software development.'
        }
      ],
      subnavItems: [
        { text: 'Overview', href: '#overview', current: true },
        { text: 'Getting started', href: '#getting-started', current: false },
        { text: 'Prompt templates', href: '#prompts', current: false },
        { text: 'Guidelines', href: '#guidelines', current: false }
      ]
    }
  }
}
