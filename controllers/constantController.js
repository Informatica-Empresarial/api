import Constants from '../lib/constants'

class ConstantsController {
  index (request, reply) {
    reply(Constants.all())
  }

  mobile (request,reply) {
    reply(Constants.mobile())
  }

  studio (request,reply) {
    reply(Constants.studio())
  }
}

export default new ConstantsController()
