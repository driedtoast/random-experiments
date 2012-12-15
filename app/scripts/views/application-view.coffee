class Lab.Views.ApplicationView extends Backbone.View

  template: 'application'

  initialize: ->
    console.log "Do somethign here "
    super

  render: ->
    console.log "rendering"
    $(@el).html(Lab.Templates['experiment_list']())
    @
