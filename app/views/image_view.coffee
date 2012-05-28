View = require 'views/view'
template = require 'views/templates/image'

module.exports = class ImageView extends View
  template: template
  tagName: 'a'
  autoRender: yes
  
  initialize: (options, @urlized_tag) ->
    super
    
    idx = @model.get('idx')
    detailLink = if @urlized_tag then "image/#{@urlized_tag}/#{idx}" else "image/#{idx}"
    @$el.attr href: detailLink
