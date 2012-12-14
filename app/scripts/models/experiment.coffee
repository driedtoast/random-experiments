

# Individual experiment
class Lab.Models.Experiment extends Backbone.Model

  constraints: {}

  initialize: (opts) ->
    console.log "create model with #{opts}"


# Gets a list of experiments
class Lab.Models.Experiments extends Backbone.Collection
  model: Lab.Models.Experiment

  path: (method) ->
    '/experiments.json'

  url: (method) ->
    p = $.param(@params(method))
    if p
      @path(method) + '?' + p
    else
      @path(method)