mediator = require 'mediator'
chaplinUtils = require 'chaplin/lib/utils'

# Application-specific utilities
# ------------------------------

# Delegate to Chaplin’s utils module
utils = chaplinUtils.beget chaplinUtils

_(utils).extend
  urlize: (url) ->
    url = $.trim url.replace /[^\w\s-]/g, ''
    url.replace /[-\s]+/g, '-'

module.exports = utils
