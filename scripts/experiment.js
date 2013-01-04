var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["backbone", "app"], function(Backbone, app) {
  Models.Experiment = (function(_super) {

    __extends(Experiment, _super);

    function Experiment() {
      return Experiment.__super__.constructor.apply(this, arguments);
    }

    Experiment.prototype.initialize = function(opts) {
      return Experiment.__super__.initialize.apply(this, arguments);
    };

    return Experiment;

  })(Backbone.Model);
  return Models.Experiments = (function(_super) {

    __extends(Experiments, _super);

    function Experiments() {
      return Experiments.__super__.constructor.apply(this, arguments);
    }

    Experiments.prototype.model = Models.Experiment;

    Experiments.prototype.path = function(method) {
      if (app.root === '/') {
        return "/experiments.json";
      } else {
        return "" + app.root + "/experiments.json";
      }
    };

    Experiments.prototype.url = function(method) {
      return this.path(method);
    };

    Experiments.prototype.add = function(models, opts) {
      var urlRoot;
      Experiments.__super__.add.call(this, models, opts);
      urlRoot = this.path();
      return this.each(function(model) {
        return model.urlRoot = urlRoot;
      });
    };

    return Experiments;

  })(Backbone.Collection);
});
