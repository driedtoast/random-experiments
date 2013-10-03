routes = require 'scripts/routes'

# The application object.
# Choose a meaningful name for your application.
module.exports = class Application extends Chaplin.Application
  title: 'Experiments'

  initDispatcher: (options) ->
    options.controllerPath = 'scripts/controllers/'
    options.controllerSuffix =  '-controller'
    @dispatcher = new Chaplin.Dispatcher options

  initRouter: (routes, options) ->
  	options.root = window.base_path + '/'
  	@router = new Chaplin.Router routes, options
  	routes(@router.match)