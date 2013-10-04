Application = require 'scripts/application'
routes = require 'scripts/routes'

# Initialize the application on DOM ready event.
$ ->
  window.base_path = window.location.pathname
  #window.base_path = '/random-experiments' 
  new Application  { routes: routes, pushState: true, root: "#{window.base_path}/" }
