fs      = require 'fs'
sysPath = require 'path'

# See docs at http://brunch.readthedocs.org/en/latest/config.html.

exports.config =
  # See http://brunch.io/#documentation for documentation.
  files:
    javascripts:
      joinTo:
        'scripts/app.js': /^app/
        'scripts/vendor.js': /^(bower_components|vendor)/

    stylesheets:
      joinTo: 'styles/index.css'
      order:
        after: ['vendor/styles/helpers.css']

    templates:
      joinTo: 'scripts/app.js'



#exports.config = 
#  files: 
#    
#    javascripts: 
#      defaultExtension: 'coffee',
#      joinTo: 
#        'scripts/vendor.js': /^vendor/
#        'scripts/app.js': /^app/
#
#    stylesheets:
#      defaultExtension: 'css'
#      joinTo: 'styles/index.css'
#
#    templates:
#      precompile: true
#      root: 'templates'
#      defaultExtension: 'hbs'
#      joinTo: 'scripts/app.js' : /^app/
#
#  #sourceMaps: false
#  wrap: 'amd'
#  # allow _ prefixed templates so partials work
#  conventions:
#    ignored: (path) ->
#      startsWith = (string, substring) ->
#        string.indexOf(substring, 0) is 0
#      sep = sysPath.sep
#      if path.indexOf("app#{sep}templates#{sep}") is 0
#        false
#      else
#        startsWith sysPath.basename(path), '_'
#
  server:
    path: 'server.coffee'
    port: 8080
    base: '/public'
    run: yes

