import { galleryService } from '../../services/gallery/service.js'
import { typeBadges } from '../../common/constants/type-badges.js'

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
    typeBadge: typeBadges[entry.type],
    summary: entry.summary,
    tags: allTags(entry),
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
