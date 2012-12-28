define ["backbone","models_experiments", "view_application"], (Backbone, Experiments, ApplicationView) ->

  class Lab.Router extends Backbone.Router
    routes:
      'experiments/:experimentId'                       : '_experimentDetail'
      "": "_index"


    initialize: (opts = {} ) ->
      opts.routes = @routes
      super


    setupExperiments: =>
      fetch = !@experimentList
      @experimentList ||= new Experiments()

      if fetch
        @experimentList.fetch
          async: false
          ifModified:false
          cache: false
      @experimentList

    _index: =>
      # Clean up a bit
      experimentList = @setupExperiments()
      applicationView = new ApplicationView
        collection: experimentList

      @layout.insertView('#content', applicationView)
      applicationView.render()

    # TODO Should be a service like object
    # TODO detail view, load modules, etc...
    # add requires, etc...
    _experimentDetail: (experimentId) =>
      experimentList = @setupExperiments()
      experiment = experimentList.get(experimentId)
      experimentSource = "scripts/#{experiment.get('source')}.js"
      # TODO try and define a module in requirejs
      # require.modules.getModule(experiment)

      requirejs [experimentSource], (ExperimentView) =>
        experimentView = new ExperimentView
          collection: experimentList
          model: experiment
        @layout.insertView('#experiment', experimentView)
        experimentView.render()


