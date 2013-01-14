var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["backbone", "libs/sketch"], function(Backbone, SketchModule) {
  return Views.HelloExperimentView = (function(_super) {

    __extends(HelloExperimentView, _super);

    function HelloExperimentView() {
      this.html = __bind(this.html, this);
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
      var container,
        _this = this;
      $('#experiment').empty();
      $(root).html(el);
      container = this.$('[data-elem="sketch-on-me"]')[0];
      this.ctx = Sketch.create({
        container: container,
        autoclear: false,
        autostart: false
      });
      this.ctx.width = 800;
      this.ctx.height = 250;
      this.ctx.draw = function() {
        _this.ctx.beginPath();
        _this.ctx.arc(random(_this.ctx.width), random(_this.ctx.height), 3, 0, TWO_PI);
        _this.ctx.fillStyle = '#776d6b';
        return _this.ctx.fill();
      };
      return this.ctx.start();
    };

    HelloExperimentView.prototype.close = function(e) {
      this.remove();
      this.ctx.stop();
      this.ctx.clear();
      return Backbone.history.navigate('/', true);
    };

    return HelloExperimentView;

  })(Backbone.View);
});
