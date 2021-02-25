Chaplin = require 'chaplin'
Experiments = require 'scripts/models/experiments'

mediator = module.exports = Chaplin.mediator

mediator.createList = ->
  mediator.experiments = new Experiments

mediator.removeList = ->
  mediator.experiments.dispose()
  mediator.experiments = null
