module.exports = (match) ->
  match '', 'image#random'
  match 'image/:idx', 'image#detail'
  match 'image/:tag/:idx', 'image#detail_tag'
  
  match 'list', 'images#index'
  match 'list/:tag', 'images#list_with_tag'
