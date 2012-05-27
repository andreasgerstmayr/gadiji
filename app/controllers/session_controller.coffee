mediator = require 'mediator'
utils = require 'lib/utils'
Controller = require 'controllers/controller'

module.exports = class SessionController extends Controller
  # Service provider instances as static properties
  # This just hardcoded here to avoid async loading of service providers.
  # In the end you might want to do this.
  @serviceProviders = {}
