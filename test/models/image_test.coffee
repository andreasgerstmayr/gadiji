Image = require 'models/image'

describe 'Image', ->
  
  afterEach ->
    @model.dispose()
  
  describe 'parse()', ->
    
    it 'should add attributes', ->
      @model = new Image {"file": "sun1.jpg",  "pub_date": 1252617373000, "tags": ["Sun", "Sky", "a(b c "]}, {parse: true}
      data = @model.toJSON()
    
      expect(data.pub_date).to.be.a Date
      expect(data.file_raw).to.be 'images/raw/sun1.jpg'
      expect(data.file_medium).to.be 'images/medium/sun1.jpg'
      expect(data.file_small).to.be 'images/small/sun1.jpg'
      expect(data.urlized_tags).to.eql ['Sun', 'Sky', 'ab-c']
