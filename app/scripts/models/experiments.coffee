Chaplin = require 'chaplin'
Experiment = require 'scripts/models/experiment'

# Gets a list of experiments
module.exports = class Experiments extends Chaplin.Collection
  model: Experiment
  url: "experiments.json"