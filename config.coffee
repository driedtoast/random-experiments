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

  server:
    path: 'server.coffee'
    port: 8080
    base: '/public'
    run: yes

