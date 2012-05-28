utils = require 'lib/utils'

describe 'Utils', ->
  
  describe 'urlize()', ->
    
    it 'should replace correctly', ->
      expect(utils.urlize 'a b c').to.be 'a-b-c'
      expect(utils.urlize ' a?b c').to.be 'ab-c'
      expect(utils.urlize '>a b c<').to.be 'a-b-c'
      expect(utils.urlize 'AbCdE 12;:-1').to.be 'AbCdE-12-1'
