import { galleryDetailController } from './controller.js'

export const galleryDetail = {
  plugin: {
    name: 'gallery-detail',
    register(server) {
      server.route({
        method: 'GET',
        path: '/gallery/{entryId}',
        ...galleryDetailController
      })
    }
  }
}
