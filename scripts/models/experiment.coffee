define ["backbone"], (Backbone) ->

  # Individual experiment
  class Models.Experiment extends Backbone.Model

    initialize: (opts) ->
      super


  # Gets a list of experiments
  class Models.Experiments extends Backbone.Collection
    model: Models.Experiment

    path: (method) ->
      "/#{window.location.pathname}/experiments.json"

    url: (method) ->
      @path(method)

    ## set the urlRoot on models as they are added so they know their routes after they are removed and their collection references are deleted.
    add: (models, opts) ->
      super models, opts
      urlRoot = @path()
      @each (model) ->
        model.urlRoot = urlRoot