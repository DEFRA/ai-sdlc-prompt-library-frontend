import { galleryService } from '../../services/gallery/service.js'

const TYPE_BADGES = {
  'agent-config': 'Agent Config',
  prompt: 'Prompt',
  workflow: 'Workflow'
}

function allTags(entry) {
  return [
    ...(entry.contentTags ?? []),
    ...(entry.useCaseTags ?? []),
    ...(entry.toolTags ?? [])
  ]
}

function toCard(entry) {
  return {
    title: entry.title,
    typeBadge: TYPE_BADGES[entry.type],
    summary: entry.summary,
    tags: allTags(entry),
    author: entry.author,
    href: `/gallery/${entry.id}`
  }
}

export const homeViewModel = {
  get() {
    const entries = galleryService.getAll()

    return {
      pageTitle: 'Defra AI Prompt Library',
      galleryCards: entries.map(toCard)
    }
  }
}
