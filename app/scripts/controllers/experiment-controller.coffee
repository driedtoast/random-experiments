
Controller = require 'scripts/controllers/base/controller'
Experiment = require 'scripts/models/experiment'
Experiments = require 'scripts/models/experiments'
ApplicationView = require 'scripts/views/application-view'

module.exports = class ExperimentController extends Controller
  setupExperiments: =>
    fetch = !@experimentList
    @experimentList ||= new Experiments()
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
    console.log experimentList
    applicationView

  show: (params) ->
    experimentId = params[0]
    experimentList = @setupExperiments()
    experiment = experimentList.get(experimentId)
    experimentSource = "scripts/views/experiment/#{experiment.get('source')}"
    # TODO try and define a module in requirejs
    # require.modules.getModule(experiment)
    requirejs [experimentSource], (ExperimentView) =>
      experimentView = new ExperimentView
        collection: experimentList
        model: experiment
        region: 'experiment'