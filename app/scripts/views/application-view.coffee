define ["backbone"], (Backbone) ->
  class Views.ApplicationView extends Backbone.View

    # Tells backbone layout manager to manage the view
    manage: true

    # Used by layout manager to append a '.html' to find it
    # via the relative path of app + below
    template: 'templates/experiment_list'

    serialize: ->
      {
        experiments: @collection.toJSON()
      }
    initialize: (opts) ->
      # Collection var isn't set auto magically
      @collection = opts.collection
      super

    html: (root, el) ->
      $('#content').empty()
      $(root).html(el)