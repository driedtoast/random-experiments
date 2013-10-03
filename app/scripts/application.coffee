routes = require 'scripts/routes'

# The application object.
# Choose a meaningful name for your application.
module.exports = class Application extends Chaplin.Application
  title: 'Experiments'

  initDispatcher: (options) ->
    options.controllerPath = 'scripts/controllers/'
    options.controllerSuffix =  '-controller'
    @dispatcher = new Chaplin.Dispatcher options