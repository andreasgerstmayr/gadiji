Controller = require 'controllers/controller'
ImagesView = require 'views/images_view'
mediator = require 'mediator'

module.exports = class ImagesController extends Controller
 
  index: ->
    @view = new ImagesView collection: mediator.allImages
    
  list_with_tag: (params) ->
    @view = new ImagesView {collection: mediator.allImages}, params.tag
