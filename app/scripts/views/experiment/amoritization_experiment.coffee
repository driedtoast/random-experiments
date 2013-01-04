# **Amoritization is Evil** is a simple experiment to illustrate amorization calculations based
# on a per month payment, percent and a total. It responds with the length of time it will take to
# pay off the amount
define ["backbone"], (Backbone) ->
  class Views.AmoritizationExperimentView extends Backbone.View

    events:
      'click [data-action="close"]'     : 'close'
      'click [data-action="calculate"]' : 'calculate'

    # Tells backbone layout manager to manage the view
    manage: true

    # Used by layout manager to append a '.html' to find it
    # via the relative path of app + below
    template: 'templates/experiments/amoritization'

    serialize: ->
      {
      name: 'world'
      }

    # Main method to calculate amoritization
    calculate: (e) ->
      # #. Get the per month, percent and the total from the inputs

      # #. Update the result div with details
      console.log "Calculating"


    initialize: (opts) ->
      @collection = opts.collection
      super

    # TODO move into common ExperimentView
    html: (root, el) ->
      $('#experiment').empty()
      $(root).html(el)

    # TODO move into common ExperimentView
    close: (e) ->
      @remove()
      Backbone.history.navigate('/',true)
