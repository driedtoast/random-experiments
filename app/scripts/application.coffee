routes = require 'scripts/routes'

Chaplin = require 'chaplin'
mediator = require 'scripts/mediator'



# The application object.
# Choose a meaningful name for your application.
module.exports = class Application extends Chaplin.Application
  title: 'Experiments'
  
  initMediator: ->
    mediator.createList()
    super.initMediator()

  start: ->
    mediator.experiments.fetch
      async: false
    super.start()