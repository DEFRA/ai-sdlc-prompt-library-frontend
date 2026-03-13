import inert from '@hapi/inert'

import { home } from './features/home/index.js'
import { health } from './features/health/index.js'
import { galleryDetail } from './features/gallery-detail/index.js'
import { serveStaticFiles } from './common/helpers/serve-static-files.js'

export const router = {
  plugin: {
    name: 'router',
    async register(server) {
      await server.register([inert])

      // Health-check route. Used by platform to check if service is running, do not remove!
      await server.register([health])

      // Application routes
      await server.register([home])
      await server.register([galleryDetail])

      // Static assets
      await server.register([serveStaticFiles])
    }
  }
}
