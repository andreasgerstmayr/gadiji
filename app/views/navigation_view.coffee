mediator = require 'mediator'
View = require 'views/view'
template = require 'views/templates/navigation'

module.exports = class NavigationView extends View
  template: template
  id: 'navigation'
  className: 'navigation'
  containerSelector: '#navigation-container'
  autoRender: true

  initialize: ->
    super
    #console.debug 'NavigationView#initialize'
    @subscribeEvent 'startupController', @render
    
    @tag = null
    @subscribeEvent 'updateNavigation', (params) ->
      @tag = params.tag
      @render()
    
  getTemplateData: ->
    data = super
    data.tag = @tag
    data
