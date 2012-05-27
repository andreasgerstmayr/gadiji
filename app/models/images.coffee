Collection = require './collection'
Image = require './image'

module.exports = class Images extends Collection
  model: Image
  url: 'images.json'
  
  initialize: ->
    super
    @initSyncMachine()
    
  fetch: ->
    @beginSync()
    super success: => @finishSync()
