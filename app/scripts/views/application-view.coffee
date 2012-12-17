define ["backbone"], (Backbone) ->
  class Views.ApplicationView extends Backbone.View

    manage: true

    template: 'templates/experiment_list'

    initialize: ->
      console.log "Do somethign here "
      super

    render: (template, context) ->
      console.log template
      console.log template(context)
      console.log @el
      console.log 'rendering '
      $(@el).html('Hello come on yeah')
      super