define ["backbone"], (Backbone) ->
  class Views.HelloExperimentView extends Backbone.View

    events:
      'click' : 'helloClick'

    # Tells backbone layout manager to manage the view
    manage: true

    # Used by layout manager to append a '.html' to find it
    # via the relative path of app + below
    template: 'templates/experiments/hello_world'

    serialize: ->
      {
        name: 'world'
      }
    initialize: (opts) ->
      # Collection var isn't set auto magically
      @collection = opts.collection
      super

    html: (root, el) ->
      $('#experiment').empty()
      $(root).html(el)

    helloClick: (e) ->
      alert('This is just to say events are bound')