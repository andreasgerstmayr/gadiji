View = require 'views/view'
template = require 'views/templates/image_page'

module.exports = class ImagePageView extends View
  template: template
  containerSelector: '#content-container'
  containerMethod: 'html'
  id: 'image-page-view'
  autoRender: yes

  initialize: (options, @previousUrl, @nextUrl) ->
    super
    
  getTemplateData: ->
    data = super
    data.previousUrl = @previousUrl
    data.nextUrl = @nextUrl
    data
