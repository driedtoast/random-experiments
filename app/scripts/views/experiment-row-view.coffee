# **Debt is Evil** is a simple experiment to illustrate debt payoff calculations based
# on a per month payment, percent and a total. It responds with the length of time it will take to
# pay off the amount
View = require 'scripts/views/base/view'
template = require 'templates/experiment_row'

module.exports = class ExperimentRowView extends View
  
  className: 'experiment-row'
  tagName: 'li'

  # Save the template string in a prototype property.
  # This is overwritten with the compiled template function.
  # In the end you might want to used precompiled templates.
  template: template

  getTemplateData: =>
    { id: @model.id, name: @model.get('name'), description: @model.get('description') }