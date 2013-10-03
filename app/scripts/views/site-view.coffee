View = require 'scripts/views/base/view'
template = require 'templates/layouts/main'

module.exports = class SiteView extends View
  container: '#main'
  id: 'site-container'
  regions:
    main: '#content'
    experiment: '#experiment'
  template: template
  template = null