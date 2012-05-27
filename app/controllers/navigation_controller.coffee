Controller = require 'controllers/controller'
NavigationView = require 'views/navigation_view'

module.exports = class NavigationController extends Controller
  initialize: ->
    super
    #console.debug 'NavigationController#initialize'
    @view = new NavigationView
