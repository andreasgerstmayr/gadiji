ImageController = require 'controllers/image_controller'
mediator = require 'mediator'

describe 'ImageController', ->
  
  beforeEach ->
    mediator.allImages = window.fixtures.images()
    mediator.allImages.beginSync()
    mediator.allImages.finishSync()
    @controller = new ImageController

  afterEach ->
    @controller.dispose()


  describe 'detail_tag()', ->
    
    it 'should find correct model and previous/next url', ->
      @controller.detail_tag {idx: 2, tag: 'Sun'}
      
      view = @controller.view
      expect(view.previousUrl).to.be 'image/Sun/1'
      expect(view.nextUrl).to.be null
      
      model = view.model.toJSON()
      expect(model.file).to.be 'sun2.jpg'
      
    it 'should find pretty tag', (done) ->
      mediator.subscribe 'updateNavigation', (params) ->
        mediator.unsubscribe 'updateNavigation'
        
        expect(params.tag).to.be 'Car 1 2-3'
        done()
        
      @controller.detail_tag {idx: 3, tag: 'Car-1-2-3'}
