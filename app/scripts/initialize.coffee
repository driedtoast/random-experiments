require 'exoskeleton'

Application = require 'scripts/application'
routes = require 'scripts/routes'

require 'console-polyfill'

# Initialize the application on DOM ready event.
# $ ->
#   window.base_path = '/random-experiments' 
#  new Application  { routes: routes, pushState: true, root: "#{window.base_path}/" }

# Initialize the application on DOM ready event.
document.addEventListener 'DOMContentLoaded', ->
  new Application {
    controllerPath: 'scripts/controllers/',
    controllerSuffix: '-controller',
    routes
  }
  # window.base_path = window.location.pathname
  # new Application  { routes: routes, pushState: true, root: "#{window.base_path}/" }
, false