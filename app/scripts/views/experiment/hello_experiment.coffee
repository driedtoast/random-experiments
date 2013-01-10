# **HelloExperiment** is a simple experiment just to get a mini experimental site working with lab like projects.
# Using [Docco](http://jashkenas.github.com/docco/) to generate the documentation.
#   docco src/*.coffee
define ["backbone", "libs/sketch"], (Backbone, SketchModule) ->
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

    html: (root, el) =>
      $('#experiment').empty()
      $(root).html(el)

      container = @$('[data-elem="sketch-on-me"]')[0]

      console.log " SKETCH IS #{Sketch}"
      @ctx = Sketch.create
        container: container
        autoclear: false
        autostart: false

      @ctx.width = 800
      @ctx.height = 250
      @ctx.draw = =>
        @ctx.beginPath()
        @ctx.arc( random( @ctx.width ), random( @ctx.height ), 3, 0, TWO_PI )
        @ctx.fillStyle = '#776d6b'
        @ctx.fill()

      @ctx.start()

    close: (e) ->
      @remove()
      @ctx.stop()
      @ctx.clear()
      Backbone.history.navigate('/',true)
