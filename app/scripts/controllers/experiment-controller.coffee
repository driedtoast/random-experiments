
Controller = require 'scripts/controllers/base/controller'
Experiment = require 'scripts/models/experiment'
Experiments = require 'scripts/models/experiments'
ApplicationView = require 'scripts/views/application-view'
mediator = require 'scripts/mediator'

module.exports = class ExperimentController extends Controller

  index: =>
    # Clean up a bit
    applicationView = new ApplicationView
      collection: mediator.experiments
      region: 'main'
    applicationView

  show: (params) =>
    experimentId = params.id
    experiment = mediator.experiments.get(experimentId)
    console.log(experiment)
    console.log(mediator.experiments)
    experimentSource = "scripts/views/experiment/#{experiment.get('source')}"
    
    ExperimentView = require experimentSource
    experimentView = new ExperimentView
      collection: mediator.experiments
      model: experiment
      region: 'experiment'