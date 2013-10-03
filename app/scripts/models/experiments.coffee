
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