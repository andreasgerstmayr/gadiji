ImagesView = require 'views/images_view'

describe 'ImagesView', ->
  
  beforeEach ->
    @collection = window.fixtures.images()
    expect(@collection).to.have.length 4

  afterEach ->
    @view.dispose()
    @collection.dispose()
  
  get_visible_links = (view) ->
    view.$el.find('a').filter ->
      $(this).css('display') != 'none'
  
  
  describe 'rendering', ->
    
    it 'should render subviews', ->
      @view = new ImagesView collection: @collection
      links = @view.$el.find 'a'
    
      expect(links).to.have.length @collection.length
      expect(links.first().children('img').attr 'src').to.be @collection.at(0).get 'file_small'
    
    it 'should fade in @slow', (done) ->
      # wait x times 100ms, last 1s
      approx_time = @collection.length * 100 + 1000
      @timeout approx_time + 1000 # bonus 1s
    
      @view = new ImagesView collection: @collection
      links = @view.$el.find 'a'
    
      # initially all links are hidden
      expect($(link).css 'opacity').to.be '0' for link in links
    
      @view.$el.queue (next) =>
        next()
      
        # once queue is finished, wait 1s for last animation
        _.delay =>
          expect($(link).css 'opacity').to.be '1' for link in links
          done()
        , 1000
    
      # in half of apprix_time, opacity of all >= 0.1 && <= 0.9
      _.delay =>
        expect($(link).css 'opacity').to.be.within 0.1, 0.9 for link in links
      , approx_time / 2
  
  
  describe 'filtering', ->
    
    it 'should filter tags', ->
      @view = new ImagesView {collection: @collection}, 'Sun'
      expect(get_visible_links @view).to.have.length 2    
      expect(@view.$el.find('a').first().attr 'href').to.contain 'Sun'
    
    it 'should filter urlized tags', ->
      @view = new ImagesView {collection: @collection}, 'Car-1-2-3'
      expect(get_visible_links @view).to.have.length 1
