CollectionView = require 'chaplin/views/collection_view'
ImageView = require './image_view'
template = require 'views/templates/images'

module.exports = class ImagesView extends CollectionView
  getTemplateFunction: -> template
  containerSelector: '#content-container'
  containerMethod: 'html'
  id: 'imageslist-view'
  
  listSelector: '.images'
  animationDuration: 0

  initialize: (options = {}, @urlized_tag = null) ->
    if @urlized_tag
      options.filterer = (image) ->
        @urlized_tag in image.get('urlized_tags') 
      
    super
    
  getView: (item) ->
    new ImageView {model: item}, @urlized_tag
  
  insertView: (item, view) ->
    super
    
    # chaplin's CollectionView sets filtered items to display: none
    return if view.$el.css('display') == 'none'
    
    view.$el.css 'opacity', 0
    @$el.queue (next) ->
      view.$el.animate {opacity: 1}, {duration: 1000}
      _.delay next, 100
