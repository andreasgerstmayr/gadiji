Controller = require 'controllers/controller'
ImagesView = require 'views/images_view'
mediator = require 'mediator'

module.exports = class ImagesController extends Controller
 
  index: ->
    mediator.publish 'updateNavigation', tag: null
    @view = new ImagesView collection: mediator.allImages
    
  list_with_tag: (params) ->
    urlized_tag = params.tag
    
    mediator.allImages.synced =>
      image = mediator.allImages.find (image) ->
        urlized_tag in image.get('urlized_tags')
      .toJSON()
      mediator.publish 'updateNavigation', tag: image.tags[image.urlized_tags.indexOf urlized_tag]
      
    @view = new ImagesView {collection: mediator.allImages}, urlized_tag
