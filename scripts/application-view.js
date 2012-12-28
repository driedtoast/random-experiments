var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["backbone"], function(Backbone) {
  return Views.ApplicationView = (function(_super) {

    __extends(ApplicationView, _super);

    function ApplicationView() {
      return ApplicationView.__super__.constructor.apply(this, arguments);
    }

    ApplicationView.prototype.manage = true;

    ApplicationView.prototype.template = 'templates/experiment_list';

    ApplicationView.prototype.serialize = function() {
      return {
        experiments: this.collection.toJSON()
      };
    };

    ApplicationView.prototype.initialize = function(opts) {
      this.collection = opts.collection;
      return ApplicationView.__super__.initialize.apply(this, arguments);
    };

    ApplicationView.prototype.html = function(root, el) {
      $('#content').empty();
      $('#experiment').empty();
      return $(root).html(el);
    };

    return ApplicationView;

  })(Backbone.View);
});
