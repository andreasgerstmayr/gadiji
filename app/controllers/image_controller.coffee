Controller = require 'controllers/controller'
ImagePageView = require 'views/image_page_view'
mediator = require 'mediator'

module.exports = class ImageController extends Controller
  historyURL: ''
      
  random: ->
    mediator.allImages.synced =>
      rand = Math.floor mediator.allImages.length * Math.random()
      @detail idx: rand
  
  detail: (params) ->
    mediator.publish 'updateNavigation', tag: null
    idx = parseInt params.idx
    
    mediator.allImages.synced =>
      model = mediator.allImages.at idx
      previousUrl = if idx > 0                             then "image/#{idx - 1}" else null
      nextUrl =     if idx + 1 < mediator.allImages.length then "image/#{idx + 1}" else null
      @view = new ImagePageView {model}, previousUrl, nextUrl
    
  detail_tag: (params) ->
    idx = parseInt params.idx
    urlized_tag = params.tag
    
    mediator.allImages.synced =>
      model = mediator.allImages.at idx
      
      filteredImages = _(mediator.allImages.toJSON()).filter (image) ->
        urlized_tag in image.urlized_tags
      
      filteredImageIndex = 0
      for image, index in filteredImages
        if image.idx == idx
          filteredImageIndex = index
          mediator.publish 'updateNavigation', tag: image.tags[image.urlized_tags.indexOf urlized_tag]
          break
          
      previousUrl = null
      if filteredImageIndex > 0
        previousImage = filteredImages[filteredImageIndex - 1]
        previousUrl = "image/#{urlized_tag}/#{previousImage.idx}"
        
      nextUrl = null
      if filteredImageIndex + 1 < filteredImages.length
        nextImage = filteredImages[filteredImageIndex + 1]
        nextUrl = "image/#{urlized_tag}/#{nextImage.idx}"
        
      @view = new ImagePageView {model}, previousUrl, nextUrl
