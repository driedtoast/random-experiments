(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("scripts/application", function(exports, require, module) {
var Application, routes, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

routes = require('scripts/routes');

module.exports = Application = (function(_super) {
  __extends(Application, _super);

  function Application() {
    this.initRouter = __bind(this.initRouter, this);
    this.initDispatcher = __bind(this.initDispatcher, this);
    this.initialize = __bind(this.initialize, this);
    _ref = Application.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Application.prototype.title = 'Experiments';

  Application.prototype.initialize = function(options) {
    if (!options) {
      options = {};
    }
    if (this.started) {
      throw new Error('Application#initialize: App was already started');
    }
    this.initRouter(options.routes, options);
    this.initDispatcher(options);
    this.initLayout(options);
    this.initComposer(options);
    this.initMediator();
    return this.start(options);
  };

  Application.prototype.initDispatcher = function(options) {
    options.controllerPath = 'scripts/controllers/';
    options.controllerSuffix = '-controller';
    return this.dispatcher = new Chaplin.Dispatcher(options);
  };

  Application.prototype.initRouter = function(routes, options) {
    options.root = window.base_path + '/';
    this.router = new Chaplin.Router(routes, options);
    return routes(this.router.match);
  };

  return Application;

})(Chaplin.Application);

});

;require.register("scripts/controllers/base/controller", function(exports, require, module) {
var Controller, SiteView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

SiteView = require('scripts/views/site-view');

module.exports = Controller = (function(_super) {
  __extends(Controller, _super);

  function Controller() {
    _ref = Controller.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Controller.prototype.beforeAction = function() {
    return this.compose('site', SiteView);
  };

  return Controller;

})(Chaplin.Controller);

});

;require.register("scripts/controllers/experiment-controller", function(exports, require, module) {
var ApplicationView, Controller, Experiment, ExperimentController, Experiments, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Controller = require('scripts/controllers/base/controller');

Experiment = require('scripts/models/experiment');

Experiments = require('scripts/models/experiments');

ApplicationView = require('scripts/views/application-view');

module.exports = ExperimentController = (function(_super) {
  __extends(ExperimentController, _super);

  function ExperimentController() {
    this.show = __bind(this.show, this);
    this.index = __bind(this.index, this);
    this.setupExperiments = __bind(this.setupExperiments, this);
    _ref = ExperimentController.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ExperimentController.prototype.setupExperiments = function() {
    this.experimentList = new Experiments();
    this.experimentList.fetch({
      async: false,
      ifModified: false,
      cache: false
    });
    return this.experimentList;
  };

  ExperimentController.prototype.index = function() {
    var applicationView, experimentList;
    experimentList = this.setupExperiments();
    applicationView = new ApplicationView({
      collection: experimentList,
      region: 'main'
    });
    return applicationView;
  };

  ExperimentController.prototype.show = function(params) {
    var ExperimentView, experiment, experimentId, experimentList, experimentSource, experimentView;
    experimentId = params.id;
    experimentList = this.setupExperiments();
    experiment = experimentList.get(experimentId);
    experimentSource = "scripts/views/experiment/" + (experiment.get('source'));
    ExperimentView = require(experimentSource);
    return experimentView = new ExperimentView({
      collection: experimentList,
      model: experiment,
      region: 'experiment'
    });
  };

  return ExperimentController;

})(Controller);

});

;require.register("scripts/initialize", function(exports, require, module) {
var Application, routes;

Application = require('scripts/application');

routes = require('scripts/routes');

$(function() {
  window.base_path = '/random-experiments';
  return new Application({
    routes: routes,
    pushState: true,
    root: "" + window.base_path + "/"
  });
});

});

;require.register("scripts/libs/support", function(exports, require, module) {
var support;

support = utils.beget(Chaplin.support);

module.exports = support;

});

;require.register("scripts/libs/utils", function(exports, require, module) {
var utils;

utils = Chaplin.utils.beget(Chaplin.utils);

if (typeof Object.seal === "function") {
  Object.seal(utils);
}

module.exports = utils;

});

;require.register("scripts/libs/view-helper", function(exports, require, module) {
var utils,
  __slice = [].slice;

utils = require('scripts/libs/utils');

Handlebars.registerHelper('url', function() {
  var options, params, routeName, _i;
  routeName = arguments[0], params = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), options = arguments[_i++];
  return Chaplin.helpers.reverse(routeName, params);
});

});

;require.register("scripts/models/experiment", function(exports, require, module) {
var Experiment, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = Experiment = (function(_super) {
  __extends(Experiment, _super);

  function Experiment() {
    _ref = Experiment.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return Experiment;

})(Chaplin.Model);

});

;require.register("scripts/models/experiments", function(exports, require, module) {
var Experiment, Experiments, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Experiment = require('scripts/models/experiment');

module.exports = Experiments = (function(_super) {
  __extends(Experiments, _super);

  function Experiments() {
    _ref = Experiments.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Experiments.prototype.model = Experiment;

  Experiments.prototype.path = function(method) {
    if (!window.base_path || window.base_path === '/') {
      return "/experiments.json";
    } else {
      return "" + window.base_path + "/experiments.json";
    }
  };

  Experiments.prototype.url = function(method) {
    return this.path(method);
  };

  return Experiments;

})(Chaplin.Collection);

});

;require.register("scripts/routes", function(exports, require, module) {
module.exports = function(match) {
  if (!match) {
    return;
  }
  match('', 'experiment#index');
  match('/', 'experiment#index');
  match('experiments/:id', 'experiment#show');
  return match('/experiments/:id', 'experiment#show');
};

});

;require.register("scripts/views/application-view", function(exports, require, module) {
var ApplicationView, ExperimentRowView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ExperimentRowView = require('scripts/views/experiment-row-view');

module.exports = ApplicationView = (function(_super) {
  __extends(ApplicationView, _super);

  function ApplicationView() {
    _ref = ApplicationView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ApplicationView.prototype.className = 'experiment-list';

  ApplicationView.prototype.tagName = 'ul';

  ApplicationView.prototype.itemView = ExperimentRowView;

  return ApplicationView;

})(Chaplin.CollectionView);

});

;require.register("scripts/views/base/collection-view", function(exports, require, module) {
var CollectionView, View, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('scripts/views/base/view');

module.exports = CollectionView = (function(_super) {
  __extends(CollectionView, _super);

  function CollectionView() {
    _ref = CollectionView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  CollectionView.prototype.getTemplateFunction = View.prototype.getTemplateFunction;

  return CollectionView;

})(Chaplin.CollectionView);

});

;require.register("scripts/views/base/view", function(exports, require, module) {
var View, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

require('scripts/libs/view-helper');

module.exports = View = (function(_super) {
  __extends(View, _super);

  function View() {
    _ref = View.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  View.prototype.getTemplateFunction = function() {
    var template, templateFunc;
    template = this.template;
    if (typeof template === 'string') {
      templateFunc = Handlebars.compile(template);
      this.constructor.prototype.template = templateFunc;
    } else {
      templateFunc = template;
    }
    return templateFunc;
  };

  View.prototype.render = function() {
    var returnValue;
    returnValue = View.__super__.render.apply(this, arguments);
    if (typeof this.afterRender === "function") {
      this.afterRender();
    }
    return returnValue;
  };

  View.prototype.close = function(e) {
    this.remove();
    return Backbone.history.navigate('/#', true);
  };

  return View;

})(Chaplin.View);

});

;require.register("scripts/views/experiment-row-view", function(exports, require, module) {
var ExperimentRowView, View, template, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('scripts/views/base/view');

template = require('templates/experiment_row');

module.exports = ExperimentRowView = (function(_super) {
  __extends(ExperimentRowView, _super);

  function ExperimentRowView() {
    this.getTemplateData = __bind(this.getTemplateData, this);
    _ref = ExperimentRowView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  ExperimentRowView.prototype.className = 'experiment-row';

  ExperimentRowView.prototype.tagName = 'li';

  ExperimentRowView.prototype.template = template;

  ExperimentRowView.prototype.getTemplateData = function() {
    return {
      id: this.model.id,
      name: this.model.get('name'),
      description: this.model.get('description')
    };
  };

  return ExperimentRowView;

})(View);

});

;require.register("scripts/views/experiment/debt_experiment", function(exports, require, module) {
var DebtExperimentView, View, template, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('scripts/views/base/view');

template = require('templates/experiments/debt');

module.exports = DebtExperimentView = (function(_super) {
  __extends(DebtExperimentView, _super);

  function DebtExperimentView() {
    _ref = DebtExperimentView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  DebtExperimentView.prototype.events = {
    'click [data-action="close"]': 'close',
    'click [data-action="calculate"]': 'calculate'
  };

  DebtExperimentView.prototype.autoRender = true;

  DebtExperimentView.prototype.template = template;

  template = null;

  DebtExperimentView.prototype.interest = function(balance, percent) {
    var monthlyPay;
    monthlyPay = balance * percent;
    return monthlyPay / 12;
  };

  DebtExperimentView.prototype.how_long = function(balance, percent, payment) {
    var count, debtBalance, interest, percentOnDebt, totalInterest;
    percentOnDebt = percent * 0.01;
    debtBalance = balance;
    count = 0;
    totalInterest = 0;
    while (debtBalance > 0) {
      interest = this.interest(debtBalance, percentOnDebt);
      totalInterest = interest + totalInterest;
      debtBalance = debtBalance + interest;
      debtBalance = debtBalance - payment;
      count = count + 1;
    }
    return {
      interest: Math.round(totalInterest * 100) / 100,
      count: count
    };
  };

  DebtExperimentView.prototype.calculate = function(e) {
    var currentTotal, perMonth, percent, result, resultOutput;
    perMonth = parseInt(this.$('[name="per_month"]').val(), 10);
    percent = parseInt(this.$('[name="percent"]').val(), 10);
    currentTotal = parseInt(this.$('[name="current_total"]').val(), 10);
    if (perMonth && percent && currentTotal) {
      result = this.how_long(currentTotal, percent, perMonth);
      resultOutput = "<div class=\"months\" >Months: " + result.count + "</div><div class=\"interest\" >Total Interest: " + result.interest + "</div>";
      return this.$('[data-elem="results"]').html(resultOutput);
    }
  };

  return DebtExperimentView;

})(View);

});

;require.register("scripts/views/experiment/gravatar_experiment", function(exports, require, module) {
var GravatarExperimentView, View, template, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('scripts/views/base/view');

template = require('templates/experiments/gravatar');

module.exports = GravatarExperimentView = (function(_super) {
  __extends(GravatarExperimentView, _super);

  function GravatarExperimentView() {
    this.changeAvatar = __bind(this.changeAvatar, this);
    _ref = GravatarExperimentView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  GravatarExperimentView.prototype.events = {
    'click [data-action="close"]': 'close',
    'change [data-elem="email"]': 'changeAvatar'
  };

  GravatarExperimentView.prototype.autoRender = true;

  GravatarExperimentView.prototype.template = template;

  template = null;

  GravatarExperimentView.prototype.changeAvatar = function(e) {
    var avatarEl, emailAddress, imageUrl;
    if ((emailAddress = $(e.currentTarget).val())) {
      imageUrl = "http://www.gravatar.com/avatar/" + (md5(emailAddress)) + ".jpg?s=80&d=https://d1vk1po2s93fx0.cloudfront.net/assets/info/avatar-empty-f47c5c13282838f4afa0d2dc90acb42a.png";
      avatarEl = this.$('#avatar');
      avatarEl.empty();
      return avatarEl.append("<img src=\"" + imageUrl + "\" />");
    }
  };

  return GravatarExperimentView;

})(View);

});

;require.register("scripts/views/experiment/hello_experiment", function(exports, require, module) {
var HelloExperimentView, View, template, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('scripts/views/base/view');

template = require('templates/experiments/hello_world');

module.exports = HelloExperimentView = (function(_super) {
  __extends(HelloExperimentView, _super);

  function HelloExperimentView() {
    this.afterRender = __bind(this.afterRender, this);
    _ref = HelloExperimentView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  HelloExperimentView.prototype.events = {
    'click [data-action="close"]': 'close'
  };

  HelloExperimentView.prototype.autoRender = true;

  HelloExperimentView.prototype.template = template;

  template = null;

  HelloExperimentView.prototype.getTemplateData = function() {
    return {
      name: 'world'
    };
  };

  HelloExperimentView.prototype.afterRender = function() {
    var container,
      _this = this;
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

  HelloExperimentView.prototype.remove = function() {
    HelloExperimentView.__super__.remove.apply(this, arguments);
    this.ctx.stop();
    return this.ctx.clear();
  };

  return HelloExperimentView;

})(View);

});

;require.register("scripts/views/experiment/pos_experiment", function(exports, require, module) {
var PosExperimentView, View, template, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('scripts/views/base/view');

template = require('templates/experiments/pos');

module.exports = PosExperimentView = (function(_super) {
  __extends(PosExperimentView, _super);

  function PosExperimentView() {
    _ref = PosExperimentView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  PosExperimentView.prototype.events = {
    'click [data-action="analyze"]': 'analyze',
    'click [data-action="close"]': 'close'
  };

  PosExperimentView.prototype.autoRender = true;

  PosExperimentView.prototype.template = template;

  template = null;

  PosExperimentView.prototype.questionReponses = {
    eat: [
      {
        text: function(noun) {
          return "Sometimes I eat " + noun;
        },
        emotion: 1
      }, {
        text: function(noun) {
          return "Eating " + noun + " is not very healthy";
        },
        emotion: 1
      }
    ],
    read: [
      {
        text: function(noun) {
          return "Well I'm reading your question right now";
        },
        emotion: 1
      }, {
        text: function(noun) {
          return "I read parts of speech mostly";
        },
        emotion: 1
      }
    ]
  };

  PosExperimentView.prototype.taskReponses = {
    call: [
      {
        text: function(noun) {
          return "Why do you want to call " + noun + "?";
        },
        emotion: 1
      }, {
        text: function(noun) {
          return "You still like " + noun + "?";
        },
        emotion: 1
      }
    ],
    make: [
      {
        text: function(noun) {
          return "Do you really think I can make " + noun + "?";
        },
        emotion: 1
      }, {
        text: function(noun) {
          return "If I could make " + noun + " I wouldn't be here";
        },
        emotion: 1
      }, {
        text: function(noun) {
          return "I can only do so much. You could make your own " + noun;
        },
        emotion: 1
      }
    ]
  };

  PosExperimentView.prototype.firstVerb = function(taggedWords) {
    var tag, taggedWord, word, _i, _len;
    for (_i = 0, _len = taggedWords.length; _i < _len; _i++) {
      taggedWord = taggedWords[_i];
      word = taggedWord[0];
      tag = taggedWord[1];
      if (_.include(['PP', 'VB', 'VBN'], tag)) {
        return word;
      }
    }
  };

  PosExperimentView.prototype.firstNouns = function(taggedWords) {
    var nouns, tag, taggedWord, word, _i, _len;
    nouns = "";
    for (_i = 0, _len = taggedWords.length; _i < _len; _i++) {
      taggedWord = taggedWords[_i];
      word = taggedWord[0];
      tag = taggedWord[1];
      if (_.include(['NN', 'NNS', 'NNP'], tag)) {
        nouns += " " + word;
      } else if (nouns.length > 1) {
        return nouns;
      }
    }
    return nouns;
  };

  PosExperimentView.prototype.randomListItem = function(list) {
    var idx, max;
    max = list.length;
    idx = Math.floor(Math.random() * max);
    return list[idx];
  };

  PosExperimentView.prototype.questionResponse = function(taggedWords) {
    var nouns, response, responses, verb;
    verb = this.firstVerb(taggedWords);
    nouns = this.firstNouns(taggedWords);
    if (verb && (responses = this.questionReponses[verb.toLowerCase()]) && (response = this.randomListItem(responses))) {
      return response.text(nouns);
    } else {
      return "Looks like you might be asking a question about " + nouns + "?";
    }
  };

  PosExperimentView.prototype.taskResponse = function(taggedWords) {
    var nouns, response, responses, verb;
    verb = this.firstVerb(taggedWords);
    nouns = this.firstNouns(taggedWords);
    if (verb && (responses = this.taskReponses[verb.toLowerCase()]) && (response = this.randomListItem(responses))) {
      return response.text(nouns);
    } else {
      return "Do you need to do something related to " + nouns + "?";
    }
  };

  PosExperimentView.prototype.analyze = function(e) {
    var firstTag, firstWord, resultOutput, tag, taggedWord, taggedWords, textValue, word, words, _i, _len;
    textValue = this.$('[name="description"]').val();
    if (textValue) {
      words = new Lexer().lex(textValue);
      taggedWords = new POSTagger().tag(words);
      resultOutput = "";
      firstWord = taggedWords[0];
      firstTag = firstWord[1];
      if (_.include(['WRB', 'WP', 'WDT', 'VBP'], firstTag)) {
        resultOutput += "<div class=\"type\" >" + (this.questionResponse(taggedWords)) + "<br /></div>";
      } else if (_.include(['PP', 'VB', 'VBN'], firstTag)) {
        resultOutput += "<div class=\"type\" >" + (this.taskResponse(taggedWords)) + "<br /></div>";
      } else if ('PRP' === firstTag) {
        resultOutput += "<div class=\"type\" >Need to communicate someone for this? <br /></div>";
      }
      for (_i = 0, _len = taggedWords.length; _i < _len; _i++) {
        taggedWord = taggedWords[_i];
        word = taggedWord[0];
        tag = taggedWord[1];
        resultOutput += "<div class=\"pos-item\" >Word: " + word + ", TAG: " + tag + "</div>";
      }
      return this.$('[data-elem="results"]').html(resultOutput);
    }
  };

  return PosExperimentView;

})(View);

});

;require.register("scripts/views/experiment/simple_box_experiment", function(exports, require, module) {
var SimpleBoxExperimentView, View, template, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('scripts/views/base/view');

template = require('templates/experiments/simple_box');

module.exports = SimpleBoxExperimentView = (function(_super) {
  __extends(SimpleBoxExperimentView, _super);

  function SimpleBoxExperimentView() {
    this.afterRender = __bind(this.afterRender, this);
    this.addShape = __bind(this.addShape, this);
    this.renderScene = __bind(this.renderScene, this);
    _ref = SimpleBoxExperimentView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  SimpleBoxExperimentView.prototype.events = {
    'click [data-action="close"]': 'close',
    'click [data-elem="sketch-on-me"]': 'addShape'
  };

  SimpleBoxExperimentView.prototype.autoRender = true;

  SimpleBoxExperimentView.prototype.template = template;

  template = null;

  SimpleBoxExperimentView.prototype.initialize = function() {
    var thirdPartyRoot;
    SimpleBoxExperimentView.__super__.initialize.apply(this, arguments);
    thirdPartyRoot = window.base_path || '';
    Physijs.scripts.worker = "" + thirdPartyRoot + "/third-party/physijs_worker.js";
    return Physijs.scripts.ammo = "" + thirdPartyRoot + "/third-party/ammo.js";
  };

  SimpleBoxExperimentView.prototype.addLight = function() {
    var light;
    light = new THREE.DirectionalLight(0xFFFFFF);
    light.position.set(20, 40, -15);
    light.target.position.copy(this.scene.position);
    light.castShadow = true;
    light.shadowCameraLeft = -60;
    light.shadowCameraTop = -60;
    light.shadowCameraRight = 60;
    light.shadowCameraBottom = 60;
    light.shadowCameraNear = 20;
    light.shadowCameraFar = 200;
    light.shadowBias = -0.0001;
    light.shadowMapWidth = light.shadowMapHeight = 2048;
    light.shadowDarkness = 0.7;
    return this.scene.add(light);
  };

  SimpleBoxExperimentView.prototype.initScene = function() {
    var container, height, width,
      _this = this;
    container = this.$('[data-elem="sketch-on-me"]')[0];
    width = 650;
    height = 450;
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    this.renderer.setSize(width, height);
    this.renderer.shadowMapEnabled = true;
    this.renderer.shadowMapSoft = true;
    container.appendChild(this.renderer.domElement);
    this.scene = new Physijs.Scene();
    this.scene.setGravity(new THREE.Vector3(0, -30, 0));
    this.scene.addEventListener('update', function() {
      return _this.scene.simulate(void 0, 2);
    });
    this.camera = new THREE.PerspectiveCamera(35, width / height, 1, 1000);
    this.camera.position.set(50, 10, 50);
    this.camera.lookAt(this.scene.position);
    this.scene.add(this.camera);
    this.box = new Physijs.BoxMesh(new THREE.CubeGeometry(50, 2, 50), new THREE.MeshBasicMaterial({
      color: 0x888888
    }), 0);
    this.box.receiveShadow = true;
    this.scene.add(this.box);
    this.addLight();
    return requestAnimationFrame(this.renderScene);
  };

  SimpleBoxExperimentView.prototype.renderScene = function() {
    this.scene.simulate();
    this.renderer.render(this.scene, this.camera);
    return requestAnimationFrame(this.renderScene);
  };

  SimpleBoxExperimentView.prototype.addShape = function() {
    var material, shape;
    material = Physijs.createMaterial(new THREE.MeshLambertMaterial({
      opacity: 1,
      transparent: true
    }), 0.6, 0.3);
    shape = new Physijs.BoxMesh(new THREE.CubeGeometry(3, 3, 3), material);
    shape.material.color.setRGB(Math.random() * 100 / 100, Math.random() * 100 / 100, Math.random() * 100 / 100);
    shape.castShadow = true;
    shape.receiveShadow = true;
    shape.position.set(Math.random() * 30 - 15, 20, Math.random() * 30 - 15);
    shape.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    return this.scene.add(shape);
  };

  SimpleBoxExperimentView.prototype.afterRender = function() {
    return this.initScene();
  };

  return SimpleBoxExperimentView;

})(View);

});

;require.register("scripts/views/site-view", function(exports, require, module) {
var SiteView, View, template, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('scripts/views/base/view');

template = require('templates/layouts/main');

module.exports = SiteView = (function(_super) {
  __extends(SiteView, _super);

  function SiteView() {
    _ref = SiteView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  SiteView.prototype.container = '#main';

  SiteView.prototype.id = 'site-container';

  SiteView.prototype.regions = {
    main: '#content',
    experiment: '#experiment'
  };

  SiteView.prototype.template = template;

  template = null;

  return SiteView;

})(View);

});

;require.register("templates/experiment_row", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<a href=\"/experiments/";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</a> ";
  if (stack1 = helpers.description) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.description; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1);
  return buffer;
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("templates/experiments/css-transition-fun", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"modal experiment-modal\">\n<div class=\"modal-header\"><h3>Css Transition fun</h3>\n  <a class=\"experiment-close\" data-action=\"close\">x</a>\n</div>\n<div class=\"modal-body\"><p>\n   Expanding Css transition box\n   <input type=\"text\" class=\"expanding-input\" />\n</p></div>\n<div class=\"modal-footer\"><a data-action=\"docs\" href=\"docs/css-transition-fun.html\" data-bypass=\"true\">Documentation</a></div>\n</div>\n<div class=\"modal-backdrop experiment-backdrop\"></div>\n</div>\n";
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("templates/experiments/debt", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<!-- TODO make snippets for handlebars? -->\n<div class=\"modal experiment-modal\">\n    <div class=\"modal-header\"><h3>Debt is evil</h3>\n        <a class=\"experiment-close\" data-action=\"close\">x</a>\n    </div>\n    <div class=\"modal-body\">\n        <div class=\"calculator\">\n        <p>\n        <label>Per month:</label><input type=\"text\" name=\"per_month\" />\n        </p>\n        <p>\n        <label>Percentage:</label><input type=\"text\" name=\"percent\" />%\n        </p>\n        <p>\n        <label>Current Balance:</label><input type=\"text\" name=\"current_total\" />\n        </p>\n        <p>\n          <button data-action=\"calculate\" >Calculate</button>\n        </p>\n        </div>\n        <div class=\"calc-results\" data-elem=\"results\"></div>\n    </div>\n    <div class=\"modal-footer\"><a data-action=\"docs\" href=\"docs/debt_experiment.html\" data-bypass=\"true\">Documentation</a></div>\n</div>\n<div class=\"modal-backdrop experiment-backdrop\"></div>\n</div>\n";
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("templates/experiments/gravatar", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"modal experiment-modal\">\n<div class=\"modal-header\"><h3>Gravatar Experiment</h3>\n  <a class=\"experiment-close\" data-action=\"close\">x</a>\n</div>\n<div class=\"modal-body\"><p>\n    <p>\n    Email address: <input type=\"email\" data-elem=\"email\" />\n    </p>\n    <div id=\"avatar\">\n    </div>\n</p></div>\n<div class=\"modal-footer\"><a data-action=\"docs\" href=\"docs/gravatar_experiment.html\" data-bypass=\"true\">Documentation</a></div>\n</div>\n<div class=\"modal-backdrop experiment-backdrop\"></div>\n</div>\n";
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("templates/experiments/hello_world", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"modal experiment-modal\">\n<div class=\"modal-header\"><h3>Hello ";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "!</h3>\n  <a class=\"experiment-close\" data-action=\"close\">x</a>\n</div>\n<div class=\"modal-body\"><p>\n    This is the first experiment to work out the structure of the loading and starting of experiments\n    <div data-elem=\"sketch-on-me\">\n\n    </div>\n</p></div>\n<div class=\"modal-footer\"><a data-action=\"docs\" href=\"docs/hello_experiment.html\" data-bypass=\"true\">Documentation</a></div>\n</div>\n<div class=\"modal-backdrop experiment-backdrop\"></div>\n</div>\n";
  return buffer;
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("templates/experiments/pos", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<!-- TODO make snippets for handlebars? -->\n<div class=\"modal experiment-modal\">\n    <div class=\"modal-header\"><h3>Parts of Speech Analysis</h3>\n        <a class=\"experiment-close\" data-action=\"close\">x</a>\n    </div>\n    <div class=\"modal-body\">\n        <div class=\"calculator\">\n            <p>\n                <label>Enter some text:</label><textarea name=\"description\" ></textarea>\n            </p>\n            <p>\n                <button data-action=\"analyze\" >Analyze</button>\n            </p>\n        </div>\n        <div class=\"calc-results\" data-elem=\"results\"></div>\n    </div>\n    <div class=\"modal-footer\"><a data-action=\"docs\" href=\"docs/pos_experiment.html\" data-bypass=\"true\">Documentation</a></div>\n</div>\n<div class=\"modal-backdrop experiment-backdrop\"></div>\n</div>\n";
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("templates/experiments/simple_box", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"modal experiment-modal\">\n    <div class=\"modal-header\"><h3>Simple Box Physics!</h3>\n        <a class=\"experiment-close\" data-action=\"close\">x</a>\n    </div>\n    <div class=\"modal-body\">\n        <div data-elem=\"sketch-on-me\">\n        </div>\n    </div>\n    <div class=\"modal-footer\"><a data-action=\"docs\" href=\"docs/simple_box_experiment.html\" data-bypass=\"true\">Documentation</a></div>\n</div>\n<div class=\"modal-backdrop experiment-backdrop\"></div>\n</div>\n";
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("templates/layouts/main", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<section id=\"content\" class=\"content\"></section>\n<aside id=\"experiment\" class=\"secondary\"></aside>\n";
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;
//@ sourceMappingURL=app.js.map