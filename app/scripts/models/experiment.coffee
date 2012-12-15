define ["backbone"], (Backbone) ->

  # Individual experiment
  class Models.Experiment extends Backbone.Model

    constraints: {}

    initialize: (opts) ->
      console.log "create model with #{opts}"


  # Gets a list of experiments
  class Models.Experiments extends Backbone.Collection
    model: Models.Experiment

    path: (method) ->
      '/experiments.json'

    url: (method) ->
      @path(method)