
class Lab.Router extends Backbone.Router
  routes:
    'experiments'                                     : '_index'
    'experiments/:experimentId'                       : '_experimentDetail'

  initialize: (opts) ->
    console.log ' initializing router '


  _index: ->
    fetch = !@experimentList
    @experimentList ||= new Lab.Models.Experiments()
    applicationView = new Lab.Views.ApplicationView
      collection: @experimentList
    if fetch
      @experimentList.fetch
        success: =>
          applicationView.render()
    else
      applicationView.render()

  _experimentDetail: (experimentId) ->
    # TODO detail view, load modules, etc...
    # add requires, etc...
    console.log "this is the detail for #{experimentId}"