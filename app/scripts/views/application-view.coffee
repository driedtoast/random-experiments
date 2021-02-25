ExperimentRowView = require 'scripts/views/experiment-row-view'
Chaplin = require 'chaplin'

module.exports = class ApplicationView extends Chaplin.CollectionView

  className: 'experiment-list'
  tagName: 'ul'
  itemView: ExperimentRowView