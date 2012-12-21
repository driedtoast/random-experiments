define ["backbone"], (Backbone) ->
  class Views.ApplicationView extends Backbone.View

    manage: true

    template: 'templates/experiment_list'

    initialize: ->
      super

    #render: (template, context) ->
    #  console.log template
    #  console.log @el
    #  console.log 'rendering '
    #  $(@el).html('Hello come on yeah')
    #  super