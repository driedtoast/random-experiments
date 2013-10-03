
Controller = require 'scripts/controllers/base/controller'
Experiment = require 'scripts/models/experiment'
Experiments = require 'scripts/models/experiments'
ApplicationView = require 'scripts/views/application-view'

module.exports = class ExperimentController extends Controller
  setupExperiments: =>
    # TODO cache the call?
    @experimentList = new Experiments()
    @experimentList.fetch
        async: false
        ifModified:false
        cache: false
    @experimentList

  index: =>
    # Clean up a bit
    experimentList = @setupExperiments()
    applicationView = new ApplicationView
      collection: experimentList
      region: 'main'
    applicationView

  show: (params) =>
    experimentId = params.id
    experimentList = @setupExperiments()
    experiment = experimentList.get(experimentId)
    experimentSource = "scripts/views/experiment/#{experiment.get('source')}"
    
    ExperimentView = require experimentSource
    experimentView = new ExperimentView
      collection: experimentList
      model: experiment
      region: 'experiment'