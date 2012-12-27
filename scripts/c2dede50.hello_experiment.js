var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["backbone"], function(Backbone) {
  return Views.HelloExperimentView = (function(_super) {

    __extends(HelloExperimentView, _super);

    function HelloExperimentView() {
      return HelloExperimentView.__super__.constructor.apply(this, arguments);
    }

    HelloExperimentView.prototype.events = {
      'click [data-action="close"]': 'close'
    };

    HelloExperimentView.prototype.manage = true;

    HelloExperimentView.prototype.template = 'templates/experiments/hello_world';

    HelloExperimentView.prototype.serialize = function() {
      return {
        name: 'world'
      };
    };

    HelloExperimentView.prototype.initialize = function(opts) {
      this.collection = opts.collection;
      return HelloExperimentView.__super__.initialize.apply(this, arguments);
    };

    HelloExperimentView.prototype.html = function(root, el) {
      $('#experiment').empty();
      return $(root).html(el);
    };

    HelloExperimentView.prototype.close = function(e) {
      console.log("Closing the hello experiment");
      this.remove();
      return Backbone.history.navigate('/', true);
    };

    return HelloExperimentView;

  })(Backbone.View);
});
