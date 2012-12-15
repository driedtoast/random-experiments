
class Lab.Router extends Backbone.Router
  routes:
    'experiments'                                     : '_index'
    'experiments/:experimentId'                       : '_experimentDetail'


  initialize: (opts = {} ) ->
    opts.routes = @routes
    console.log ' initializing router '
    super


  _index: ->
    fetch = !@experimentList
    @experimentList ||= new Lab.Models.Experiments()
    applicationView = new Lab.Views.ApplicationView
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

$('a[data-relative]').live 'click', (event) ->
  event.preventDefault()
  event.stopPropagation()
  target = $(event.currentTarget)
  if !target.data('disabled')
    url = Backbone.history.getFragment(target.attr('href'))
    Lab.router.navigate(url, target)
