var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["backbone"], function(Backbone) {
  return Views.AmoritizationExperimentView = (function(_super) {

    __extends(AmoritizationExperimentView, _super);

    function AmoritizationExperimentView() {
      return AmoritizationExperimentView.__super__.constructor.apply(this, arguments);
    }

    AmoritizationExperimentView.prototype.events = {
      'click [data-action="close"]': 'close',
      'click [data-action="calculate"]': 'calculate'
    };

    AmoritizationExperimentView.prototype.manage = true;

    AmoritizationExperimentView.prototype.template = 'templates/experiments/amoritization';

    AmoritizationExperimentView.prototype.serialize = function() {
      return {
        name: 'world'
      };
    };

    AmoritizationExperimentView.prototype.calculate = function(e) {
      return console.log("Calculating");
    };

    AmoritizationExperimentView.prototype.initialize = function(opts) {
      this.collection = opts.collection;
      return AmoritizationExperimentView.__super__.initialize.apply(this, arguments);
    };

    AmoritizationExperimentView.prototype.html = function(root, el) {
      $('#experiment').empty();
      return $(root).html(el);
    };

    AmoritizationExperimentView.prototype.close = function(e) {
      this.remove();
      return Backbone.history.navigate('/', true);
    };

    return AmoritizationExperimentView;

  })(Backbone.View);
});
