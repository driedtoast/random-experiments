define ["backbone","models_experiments", "view_application"], (Backbone, Experiments, ApplicationView) ->

  class Lab.Router extends Backbone.Router
    routes:
      'experiments'                                     : '_index'
      'experiments/:experimentId'                       : '_experimentDetail'
      "": "_index"


    initialize: (opts = {} ) ->
      opts.routes = @routes
      super


    _index: =>
      # Clean up a bit
      fetch = !@experimentList
      @experimentList ||= new Experiments()

      if fetch
        @experimentList.fetch
          async: false
          ifModified:false
          cache: false

      applicationView = new ApplicationView
        collection: @experimentList
        model: @experimentList

      @layout.insertView('#content', applicationView)
      applicationView.render()

    _experimentDetail: (experimentId) ->
      # TODO Should be a service like object
      # TODO detail view, load modules, etc...
      # add requires, etc...
      console.log "this is the detail for #{experimentId}"
