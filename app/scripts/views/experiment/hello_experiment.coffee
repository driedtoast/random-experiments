View = require 'scripts/views/base/view'
SketchModule = require 'vendors/sketch'
template = require 'templates/experiments/hello_world'

# **HelloExperiment** is a simple experiment just to get a mini experimental site working with lab like projects.
# Using [Docco](http://jashkenas.github.com/docco/) to generate the documentation.
#   docco src/*.coffee
module.exports = class HelloExperimentView extends View

  events:
    'click [data-action="close"]' : 'close'

  autoRender: true
    
  template: template
  template = null

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

  remove: ->
    super
    @ctx.stop()
    @ctx.clear()