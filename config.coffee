fs      = require 'fs'
sysPath = require 'path'

# See docs at http://brunch.readthedocs.org/en/latest/config.html.

exports.config = 

  files: 
    
    javascripts: 
      defaultExtension: 'coffee',
      joinTo: 
        'scripts/vendor.js': /^vendor/
        'scripts/config.js': /^app\/config.+/

      order: 
        before: [
          'vendor/scripts/require.js',
          'vendor/scripts/almond.js',
          'vendor/scripts/jquery.js',
          'vendor/scripts/handlebars.js',
          'vendor/scripts/handlebars.runtime.js',
          'vendor/scripts/lodash.js',
          'vendor/scripts/backbone.js'
          ]
      pluginHelpers: 'scripts/vendor.js'

    stylesheets:
      defaultExtension: 'css'
      joinTo: 'styles/index.css'
      order:
        before: ['vendor/styles/bootstrap.css']

    templates:
      precompile: true
      root: 'templates'
      defaultExtension: 'hbs'
      joinTo: 'scripts/compiled-templates.js' : /^app/

  modules:
    addSourceURLs: true
    wrapper: 'commonjs'
    definition: 'commonjs'
    nameCleaner: (path) ->
      path.replace(/^app\//, '')

  sourceMaps: false

  # allow _ prefixed templates so partials work
  conventions:
    ignored: (path) ->
      startsWith = (string, substring) ->
        string.indexOf(substring, 0) is 0
      sep = sysPath.sep
      if path.indexOf("app#{sep}templates#{sep}") is 0
        false
      else
        startsWith sysPath.basename(path), '_'

  server:
    path: 'server.coffee'
    port: 8080
    base: '/public'
    run: yes

