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
      fetch = !@experimentList
      @experimentList ||= new Experiments()
      applicationView = new ApplicationView
        collection: @experimentList
        model: @experimentList

      if fetch
        @experimentList.fetch
          async: false
          error: (response, model) ->
            # TODO is going in this block so we need to figure out why backbone isn't parsing it
            console.log " ERROR? "
            console.log response
            console.log model

          success: (response, model) ->
            console.log " IN success block"
            console.log model

      @layout.insertView('#content', applicationView)
      applicationView.render()

    _experimentDetail: (experimentId) ->
      # TODO detail view, load modules, etc...
      # add requires, etc...
      console.log "this is the detail for #{experimentId}"