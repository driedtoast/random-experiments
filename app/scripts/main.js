
window.Lab = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  Templates: {},
  init: function() {
    this.router = new Lab.Router();
    Backbone.history.start({pushState: true});
    window.onbeforeunload = function(event) {
      if (Lab.router.canFreelyNavigate()) {
        this.router._navigationPromptMessage();
      }
    }
    console.log('Hello from Backbone!');
  }
};

$(document).ready(function(){
  Lab.init();
});
