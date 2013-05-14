var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["backbone", "libs/md5"], function(Backbone, md5) {
  return Views.GravatarExperimentView = (function(_super) {

    __extends(GravatarExperimentView, _super);

    function GravatarExperimentView() {
      this.changeAvatar = __bind(this.changeAvatar, this);

      this.html = __bind(this.html, this);
      return GravatarExperimentView.__super__.constructor.apply(this, arguments);
    }

    GravatarExperimentView.prototype.events = {
      'click [data-action="close"]': 'close',
      'change [data-elem="email"]': 'changeAvatar'
    };

    GravatarExperimentView.prototype.manage = true;

    GravatarExperimentView.prototype.template = 'templates/experiments/gravatar';

    GravatarExperimentView.prototype.initialize = function(opts) {
      this.collection = opts.collection;
      return GravatarExperimentView.__super__.initialize.apply(this, arguments);
    };

    GravatarExperimentView.prototype.html = function(root, el) {
      $('#experiment').empty();
      return $(root).html(el);
    };

    GravatarExperimentView.prototype.close = function(e) {
      this.remove();
      return Backbone.history.navigate('/', true);
    };

    GravatarExperimentView.prototype.changeAvatar = function(e) {
      var avatarEl, emailAddress, imageUrl;
      if ((emailAddress = $(e.currentTarget).val())) {
        imageUrl = "http://www.gravatar.com/avatar/" + (md5(emailAddress)) + ".jpg?s=80";
        avatarEl = this.$('#avatar');
        avatarEl.empty();
        return avatarEl.append("<img src=\"" + imageUrl + "\" />");
      }
    };

    return GravatarExperimentView;

  })(Backbone.View);
});
