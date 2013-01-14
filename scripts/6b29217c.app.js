define([
  // Libraries.
  "jquery",
  "lodash",
  "backbone",
  "handlebars",

  // Plugins.
  "plugins/backbone.layoutmanager"
],

function($, _, Backbone) {

  // Provide a global location to place configuration settings and module
  // creation.
  var app = {
    // The root path to run the application.
    root: "/"
  };

  window.Lab.app = app;

  // Localize or create a new JavaScript Template object.
  var JST = window.JST = window.JST || {};

  // Configure LayoutManager with Backbone Boilerplate defaults.
  Backbone.LayoutManager.configure({
    manage: true,

    paths: {
      layout: "app/templates/layouts/",
      template: "app/templates/"
    },

    fetch: function(path) {
      path = path + ".html";

      if (!JST[path]) {
        $.ajax({ url: app.root + path, async: false }).then(function(contents) {
          template = Handlebars.compile(contents);
          JST[path] = template;
        });
      }

      return JST[path];
    }
  });

  // Mix Backbone.Events, modules, and layout management into the app object.
  return _.extend(app, {
    // Create a custom object with a nested Views object.
    module: function(additionalProps) {
      return _.extend({ Views: {} }, additionalProps);
    },

    // Helper for using layouts.
    useLayout: function(name) {
      // If already using this Layout, then don't re-inject into the DOM.
      if (this.layout && this.layout.options.template === name) {
        return this.layout;
      }

      // If a layout already exists, remove it from the DOM.
      if (this.layout) {
        this.layout.remove();
      }

      // Create a new Layout.
      var layout = new Backbone.Layout({
        template: 'templates/layouts/' +name,
        className: "layout " + name,
        id: "layout"

      });


      // Insert into the DOM.
      $("#main").empty().append(layout.el);

      // Render the layout.
      layout.render();

      // Cache the refererence.
      this.layout = layout;

      // Return the reference, for chainability.
      return layout;
    }
  }, Backbone.Events);

});

window.Lab = {};
window.Views = {};
window.Models = {};