ExperimentRowView = require 'scripts/views/experiment-row-view'

module.exports = class ApplicationView extends Chaplin.CollectionView

  className: 'experiment-list'
  tagName: 'ul'
  itemView: ExperimentRowView