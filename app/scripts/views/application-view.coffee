define ["backbone"], (Backbone) ->
  class Views.ApplicationView extends Backbone.View

    # Tells backbone layout manager to manage the view
    manage: true

    # Used by layout manager to append a '.html' to find it
    # via the relative path of app + below
    template: 'templates/experiment_list'

    events:
      'click [data-role="test-bind"]': 'testClick'

    initialize: (opts) ->
      # Collection var isn't set auto magically
      @collection = opts.collection
      # Data is used to pass objects to the template
      @data =
        experiments = @collection.models
      super

    testClick: (e) ->
      alert("hurray! #{e.currentTarget.tagName}")