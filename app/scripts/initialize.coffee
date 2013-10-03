Application = require 'scripts/application'
routes = require 'scripts/routes'

# Initialize the application on DOM ready event.
$ ->
  new Application   
  	routes: routes, 
    pushState: true

  window.base_path = window.location.pathname