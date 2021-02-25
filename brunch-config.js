// See docs at http://brunch.readthedocs.org/en/latest/config.html.
module.exports = {
  // See http://brunch.io/#documentation for documentation.
  npm: {
    aliases: {
      backbone: 'exoskeleton'
    }
  },
  files: {
    javascripts: {
      defaultExtension: 'coffee',
      joinTo: {
        'scripts/app.js': /^app/,
        'scripts/vendor.js': /^(node_modules|vendor)/
      }, 
      order: {
      }
    },
    stylesheets: {
      joinTo: 'styles/index.css',
      order: {
        before: [ '/normalize/' ], 
        after: ['vendor/styles/helpers.css']
      }
    },
    templates: {
      joinTo: 'scripts/app.js'
    }
  },
  plugins: {
    coffeescript: {
      bare: true
    }
  }
}