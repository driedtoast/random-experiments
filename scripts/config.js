// Set the require.js configuration for your application.
require.config({

  // Initialize the application with the main application file.
  deps: ["main"],

  paths: {
    // JavaScript folders.
    libs: "./scripts/libs",
    plugins: "../scripts/plugins",

    // Libraries.
    jquery: "../scripts/libs/jquery",
    lodash: "../scripts/libs/lodash",
    backbone: "../scripts/libs/backbone",
    templates: "../scripts/modules/compiled-templates",
    traer: "../scripts/libs/traer",
    models_experiments: "../scripts/experiment",
    view_application: "../scripts/application-view",
    handlebars: "../scripts/libs/handlebars",
    bootstrap: "http://twitter.github.com/bootstrap/assets/js"
  },

  shim: {
    // Backbone library depends on lodash and jQuery.
    backbone: {
      deps: ["lodash", "jquery"],
      exports: "Backbone"
    },

    handlebars: {
       exports: "Handlebars"
    },
    // Backbone.LayoutManager depends on Backbone.
    "plugins/backbone.layoutmanager": ["backbone"],

    "libs/physi": ["libs/three.min"]

  }

});
