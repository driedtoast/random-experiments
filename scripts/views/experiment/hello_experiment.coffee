# **HelloExperiment** is a simple experiment just to get a mini experimental site working with lab like projects.
# Using [Docco](http://jashkenas.github.com/docco/) to generate the documentation.
#   docco src/*.coffee
define ["backbone"], (Backbone) ->
  class Views.HelloExperimentView extends Backbone.View

    events:
      'click [data-action="close"]' : 'close'

    # Tells backbone layout manager to manage the view
    manage: true

    # Used by layout manager to append a '.html' to find it
    # via the relative path of app + below
    template: 'templates/experiments/hello_world'

    serialize: ->
      {
        name: 'world'
      }

    # Simple initializer
    initialize: (opts) ->
      # Collection var isn't set auto magically
      @collection = opts.collection
      super

    html: (root, el) ->
      $('#experiment').empty()
      $(root).html(el)

    close: (e) ->
      console.log "Closing the hello experiment"
      @remove()
      Backbone.history.navigate('/',true)
