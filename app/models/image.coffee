Model = require './model'
utils = require 'lib/utils'

module.exports = class Image extends Model
  idx = 0
  
  parse: (data) ->
    data.idx = idx++
    data.pub_date = new Date(data.pub_date)
    
    data.file_raw = "#{Settings.raw}/#{data.file}"
    data.file_medium = "#{Settings.medium}/#{data.file}"
    data.file_small = "#{Settings.small}/#{data.file}"
    data.urlized_tags = _(data.tags).map utils.urlize
    
    data
