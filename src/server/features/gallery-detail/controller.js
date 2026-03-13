import Boom from '@hapi/boom'

import { galleryService } from '../../services/gallery/service.js'
import { galleryDetailViewModel } from './view-model.js'

export const galleryDetailController = {
  handler(request, h) {
    try {
      const entry = galleryService.getById(request.params.entryId)

      if (!entry) {
        return Boom.notFound()
      }

      const viewModel = galleryDetailViewModel.get(entry)

      return h.view('features/gallery-detail/index', viewModel)
    } catch (error) {
      request.logger.error({ err: error }, 'galleryDetailController failed')
      return h.view('error/index').code(500)
    }
  }
}
