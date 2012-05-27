View = require 'views/view'
template = require 'views/templates/image'

module.exports = class ImageView extends View
  template: template
  tagName: 'a'
  autoRender: yes
  
  initialize: (options, @tag) ->
    super
    
    idx = @model.get('idx')
    detailLink = if @tag then "image/#{@tag}/#{idx}" else "image/#{idx}"
    @$el.attr href: detailLink
