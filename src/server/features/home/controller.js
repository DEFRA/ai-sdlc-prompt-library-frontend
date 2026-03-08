import { homeViewModel } from './view-model.js'

export const homeController = {
  handler(_request, h) {
    return h.view('features/home/index', homeViewModel.get())
  }
}
