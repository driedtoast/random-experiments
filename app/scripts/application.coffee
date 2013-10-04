routes = require 'scripts/routes'

# The application object.
# Choose a meaningful name for your application.
module.exports = class Application extends Chaplin.Application
  title: 'Experiments'

  initialize: (options) =>
    options = {} unless options
	
    throw new Error('Application#initialize: App was already started') if (@started) 

    @initRouter(options.routes, options)
    @initDispatcher(options)
    @initLayout(options)
    @initComposer(options)
    @initMediator()
    return @start(options)

  initDispatcher: (options) =>
    options.controllerPath = 'scripts/controllers/'
    options.controllerSuffix =  '-controller'
    @dispatcher = new Chaplin.Dispatcher options

  initRouter: (routes, options) =>
    options.root = window.base_path + '/'
    @router = new Chaplin.Router(routes, options)
    routes(@router.match)