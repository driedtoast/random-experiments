define ["backbone"], (Backbone) ->
  class Views.ApplicationView extends Backbone.View

    template: 'experiment_list'

    initialize: ->
      console.log "Do somethign here "
      super