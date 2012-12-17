define ["backbone","models_experiments", "view_application"], (Backbone, Experiments, ApplicationView) ->

  class Lab.Router extends Backbone.Router
    routes:
      'experiments'                                     : '_index'
      'experiments/:experimentId'                       : '_experimentDetail'
      "": "_index"


    initialize: (opts = {} ) ->
      opts.routes = @routes
      console.log ' initializing router '
      super


    _index: ->
      console.log 'starting to render experiment list'
      fetch = !@experimentList
      @experimentList ||= new Experiments()
      applicationView = new ApplicationView
        collection: @experimentList
        model: @experimentList

      if fetch
        @experimentList.fetch()
      # Freaking out on render, infinite loop
      applicationView.render()

    _experimentDetail: (experimentId) ->
      # TODO detail view, load modules, etc...
      # add requires, etc...
      console.log "this is the detail for #{experimentId}"