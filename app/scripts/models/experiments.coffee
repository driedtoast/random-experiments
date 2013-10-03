
Experiment = require 'scripts/models/experiment'

# Gets a list of experiments
module.exports = class Experiments extends Chaplin.Collection
  model: Experiment

  path: (method) ->
    if !window.base_path || window.base_path == '/'
      "/experiments.json"
    else
      "#{window.base_path}/experiments.json"

  url: (method) ->
    @path(method)

  ## set the urlRoot on models as they are added so they know their routes after they are removed and their collection references are deleted.
  #add: (models, opts) ->
  #  console.log " modesl "
  #  console.log  models
  #  super models, opts
  #  urlRoot = @path()
  #  @each (model) ->
  #    model.urlRoot = urlRoot