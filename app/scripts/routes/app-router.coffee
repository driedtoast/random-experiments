define ["backbone","models_experiments", "view_application"], (Backbone, Models, Views) ->

  class Lab.Router extends Backbone.Router
    routes:
      "": "_index"
      'experiments'                                     : '_index'
      'experiments/:experimentId'                       : '_experimentDetail'


    initialize: (opts = {} ) ->
      opts.routes = @routes
      console.log ' initializing router '
      super


    _index: ->
      fetch = !@experimentList
      @experimentList ||= new Models()
      applicationView = new Views
        collection: @experimentList
      if fetch
        @experimentList.fetch()
        applicationView.render()
      else
        applicationView.render()

    _experimentDetail: (experimentId) ->
      # TODO detail view, load modules, etc...
      # add requires, etc...
      console.log "this is the detail for #{experimentId}"