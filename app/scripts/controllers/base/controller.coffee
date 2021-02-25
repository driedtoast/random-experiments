SiteView = require 'scripts/views/site-view'
Chaplin = require 'chaplin'

module.exports = class Controller extends Chaplin.Controller
  # Place your application-specific controller features here
  beforeAction: ->
    @reuse 'site', SiteView