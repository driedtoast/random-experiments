var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["backbone", "models_experiments", "view_application", "bootstrap/bootstrap-modal"], function(Backbone, Experiments, ApplicationView) {
  return Lab.Router = (function(_super) {

    __extends(Router, _super);

    function Router() {
      this._experimentDetail = __bind(this._experimentDetail, this);

      this._index = __bind(this._index, this);

      this.setupExperiments = __bind(this.setupExperiments, this);
      return Router.__super__.constructor.apply(this, arguments);
    }

    Router.prototype.routes = {
      'experiments/:experimentId': '_experimentDetail',
      "": "_index"
    };

    Router.prototype.initialize = function(opts) {
      if (opts == null) {
        opts = {};
      }
      opts.routes = this.routes;
      return Router.__super__.initialize.apply(this, arguments);
    };

    Router.prototype.setupExperiments = function() {
      var fetch;
      fetch = !this.experimentList;
      this.experimentList || (this.experimentList = new Experiments());
      if (fetch) {
        this.experimentList.fetch({
          async: false,
          ifModified: false,
          cache: false
        });
      }
      return this.experimentList;
    };

    Router.prototype._index = function() {
      var applicationView, experimentList;
      experimentList = this.setupExperiments();
      applicationView = new ApplicationView({
        collection: experimentList
      });
      this.layout.insertView('#content', applicationView);
      return applicationView.render();
    };

    Router.prototype._experimentDetail = function(experimentId) {
      var experiment, experimentList, experimentSource,
        _this = this;
      experimentList = this.setupExperiments();
      experiment = experimentList.get(experimentId);
      experimentSource = "scripts/" + (experiment.get('source')) + ".js";
      return requirejs([experimentSource], function(ExperimentView) {
        var experimentView;
        experimentView = new ExperimentView({
          collection: experimentList,
          model: experiment
        });
        _this.layout.insertView('#experiment', experimentView);
        return experimentView.render();
      });
    };

    return Router;

  })(Backbone.Router);
});
