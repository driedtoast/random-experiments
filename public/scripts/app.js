(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
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
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    var val = aliases[name];
    return (val && name !== val) ? expandAlias(val) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("scripts/application.coffee", function(exports, require, module) {
var Application, Chaplin, mediator, routes;

routes = require('scripts/routes');

Chaplin = require('chaplin');

mediator = require('scripts/mediator');

// The application object.
// Choose a meaningful name for your application.
module.exports = Application = (function() {
  class Application extends Chaplin.Application {
    initMediator() {
      mediator.createList();
      return super.initMediator();
    }

    start() {
      mediator.experiments.fetch({
        async: false
      });
      return super.start();
    }

  };

  Application.prototype.title = 'Experiments';

  return Application;

}).call(this);
});

;require.register("scripts/controllers/base/controller.coffee", function(exports, require, module) {
var Chaplin, Controller, SiteView;

SiteView = require('scripts/views/site-view');

Chaplin = require('chaplin');

module.exports = Controller = class Controller extends Chaplin.Controller {
  // Place your application-specific controller features here
  beforeAction() {
    return this.reuse('site', SiteView);
  }

};
});

;require.register("scripts/controllers/experiment-controller.coffee", function(exports, require, module) {
var ApplicationView, Controller, Experiment, ExperimentController, Experiments, mediator,
  boundMethodCheck = function(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new Error('Bound instance method accessed before binding'); } };

Controller = require('scripts/controllers/base/controller');

Experiment = require('scripts/models/experiment');

Experiments = require('scripts/models/experiments');

ApplicationView = require('scripts/views/application-view');

mediator = require('scripts/mediator');

module.exports = ExperimentController = class ExperimentController extends Controller {
  constructor() {
    super(...arguments);
    this.index = this.index.bind(this);
    this.show = this.show.bind(this);
  }

  index() {
    var applicationView;
    boundMethodCheck(this, ExperimentController);
    // Clean up a bit
    applicationView = new ApplicationView({
      collection: mediator.experiments,
      region: 'main'
    });
    return applicationView;
  }

  show(params) {
    var ExperimentView, experiment, experimentId, experimentSource, experimentView;
    boundMethodCheck(this, ExperimentController);
    experimentId = params.id;
    experiment = mediator.experiments.get(experimentId);
    console.log(experiment);
    console.log(mediator.experiments);
    experimentSource = `scripts/views/experiment/${experiment.get('source')}`;
    ExperimentView = require(experimentSource);
    return experimentView = new ExperimentView({
      collection: mediator.experiments,
      model: experiment,
      region: 'experiment'
    });
  }

};
});

;require.register("scripts/initialize.coffee", function(exports, require, module) {
var Application, routes;

require('exoskeleton');

Application = require('scripts/application');

routes = require('scripts/routes');

require('console-polyfill');

// Initialize the application on DOM ready event.
// $ ->
//   window.base_path = '/random-experiments' 
//  new Application  { routes: routes, pushState: true, root: "#{window.base_path}/" }

// Initialize the application on DOM ready event.
document.addEventListener('DOMContentLoaded', function() {
  return new Application({
    controllerPath: 'scripts/controllers/',
    controllerSuffix: '-controller',
    routes
  });
// window.base_path = window.location.pathname
// new Application  { routes: routes, pushState: true, root: "#{window.base_path}/" }
}, false);
});

;require.register("scripts/libs/support.coffee", function(exports, require, module) {
var Chaplin, support;

Chaplin = require('chaplin');

support = utils.beget(Chaplin.support);

module.exports = support;
});

;require.register("scripts/libs/utils.coffee", function(exports, require, module) {
var Chaplin, utils;

Chaplin = require('chaplin');

utils = Chaplin.utils.beget(Chaplin.utils);

if (typeof Object.seal === "function") {
  Object.seal(utils);
}

module.exports = utils;
});

;require.register("scripts/libs/view-helper.coffee", function(exports, require, module) {
var Chaplin, utils,
  splice = [].splice;

utils = require('scripts/libs/utils');

Chaplin = require('chaplin');

// Application-specific Handlebars helpers
// ---------------------------------------

// Get Chaplin-declared named routes. {{#url "like" "105"}}{{/url}}
Handlebars.registerHelper('url', function(routeName, ...params) {
  var options, ref;
  ref = params, [...params] = ref, [options] = splice.call(params, -1);
  return Chaplin.helpers.reverse(routeName, params);
});
});

;require.register("scripts/mediator.coffee", function(exports, require, module) {
var Chaplin, Experiments, mediator;

Chaplin = require('chaplin');

Experiments = require('scripts/models/experiments');

mediator = module.exports = Chaplin.mediator;

mediator.createList = function() {
  return mediator.experiments = new Experiments;
};

mediator.removeList = function() {
  mediator.experiments.dispose();
  return mediator.experiments = null;
};
});

;require.register("scripts/models/experiment.coffee", function(exports, require, module) {
var Chaplin, Experiment;

Chaplin = require('chaplin');

// Individual experiment
module.exports = Experiment = class Experiment extends Chaplin.Model {};

// Nothing to see here
});

;require.register("scripts/models/experiments.coffee", function(exports, require, module) {
var Chaplin, Experiment, Experiments;

Chaplin = require('chaplin');

Experiment = require('scripts/models/experiment');

// Gets a list of experiments
module.exports = Experiments = (function() {
  class Experiments extends Chaplin.Collection {};

  Experiments.prototype.model = Experiment;

  Experiments.prototype.url = "experiments.json";

  return Experiments;

}).call(this);
});

;require.register("scripts/routes.coffee", function(exports, require, module) {
// The routes for the application. This module returns a function.
// `match` is match method of the Router
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

;require.register("scripts/views/application-view.coffee", function(exports, require, module) {
var ApplicationView, Chaplin, ExperimentRowView;

ExperimentRowView = require('scripts/views/experiment-row-view');

Chaplin = require('chaplin');

module.exports = ApplicationView = (function() {
  class ApplicationView extends Chaplin.CollectionView {};

  ApplicationView.prototype.className = 'experiment-list';

  ApplicationView.prototype.tagName = 'ul';

  ApplicationView.prototype.itemView = ExperimentRowView;

  return ApplicationView;

}).call(this);
});

;require.register("scripts/views/base/collection-view.coffee", function(exports, require, module) {
var Chaplin, CollectionView, View;

View = require('scripts/views/base/view');

Chaplin = require('chaplin');

module.exports = CollectionView = (function() {
  class CollectionView extends Chaplin.CollectionView {};

  // This class doesn’t inherit from the application-specific View class,
  // so we need to borrow the method from the View prototype:
  CollectionView.prototype.getTemplateFunction = View.prototype.getTemplateFunction;

  return CollectionView;

}).call(this);
});

;require.register("scripts/views/base/view.coffee", function(exports, require, module) {
var Backbone, Chaplin, View;

require('scripts/libs/view-helper');

Chaplin = require('chaplin');

Backbone = require('backbone');

module.exports = View = class View extends Chaplin.View {
  getTemplateFunction() {
    var template, templateFunc;
    // Template compilation
    // --------------------
    // This demo uses Handlebars templates to render views.
    // The template is loaded with Require.JS and stored as string on
    // the view prototype. On rendering, it is compiled on the
    // client-side. The compiled template function replaces the string
    // on the view prototype.

    // In the end you might want to precompile the templates to JavaScript
    // functions on the server-side and just load the JavaScript code.
    // Several precompilers create a global JST hash which stores the
    // template functions. You can get the function by the template name:

    // templateFunc = JST[@templateName]
    template = this.template;
    if (typeof template === 'string') {
      // Compile the template string to a function and save it
      // on the prototype. This is a workaround since an instance
      // shouldn’t change its prototype normally.
      templateFunc = Handlebars.compile(template);
      this.constructor.prototype.template = templateFunc;
    } else {
      templateFunc = template;
    }
    return templateFunc;
  }

  render() {
    var returnValue;
    returnValue = super.render();
    if (typeof this.afterRender === "function") {
      this.afterRender();
    }
    return returnValue;
  }

  close(e) {
    this.remove();
    return Backbone.history.navigate('/#', true);
  }

};
});

;require.register("scripts/views/experiment-row-view.coffee", function(exports, require, module) {
  // **Debt is Evil** is a simple experiment to illustrate debt payoff calculations based
  // on a per month payment, percent and a total. It responds with the length of time it will take to
  // pay off the amount
var ExperimentRowView, View, template,
  boundMethodCheck = function(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new Error('Bound instance method accessed before binding'); } };

View = require('scripts/views/base/view');

template = require('templates/experiment_row');

module.exports = ExperimentRowView = (function() {
  class ExperimentRowView extends View {
    constructor() {
      super(...arguments);
      this.getTemplateData = this.getTemplateData.bind(this);
    }

    getTemplateData() {
      boundMethodCheck(this, ExperimentRowView);
      return {
        id: this.model.id,
        name: this.model.get('name'),
        description: this.model.get('description')
      };
    }

  };

  ExperimentRowView.prototype.className = 'experiment-row';

  ExperimentRowView.prototype.tagName = 'li';

  // Save the template string in a prototype property.
  // This is overwritten with the compiled template function.
  // In the end you might want to used precompiled templates.
  ExperimentRowView.prototype.template = template;

  return ExperimentRowView;

}).call(this);
});

;require.register("scripts/views/experiment/debt_experiment.coffee", function(exports, require, module) {
// **Debt is Evil** is a simple experiment to illustrate debt payoff calculations based
// on a per month payment, percent and a total. It responds with the length of time it will take to
// pay off the amount
var DebtExperimentView, View, template;

View = require('scripts/views/base/view');

template = require('templates/experiments/debt');

module.exports = DebtExperimentView = (function() {
  class DebtExperimentView extends View {
    
    // just calculates interest
    interest(balance, percent) {
      var monthlyPay;
      monthlyPay = balance * percent;
      return monthlyPay / 12;
    }

    // figures out how long based on calling @interest to calculate
    // compounding interest, monthly payment, etc...
    how_long(balance, percent, payment) {
      var count, debtBalance, interest, percentOnDebt, totalInterest;
      percentOnDebt = percent * 0.01;
      debtBalance = balance;
      count = 0;
      totalInterest = 0;
      // Loop through until the balance is 0
      // creating a summation of the period count
      while (debtBalance > 0) {
        // TODO create graph using d3, month to month view
        // Calculate current interest via a compound schedule
        interest = this.interest(debtBalance, percentOnDebt);
        // total interest paid
        totalInterest = interest + totalInterest;
        debtBalance = debtBalance + interest;
        debtBalance = debtBalance - payment;
        count = count + 1;
      }
      return {
        // Round the total interest to only have 2 decimal places
        interest: Math.round(totalInterest * 100) / 100,
        count: count
      };
    }

    // Main method to calculate debt
    calculate(e) {
      var currentTotal, perMonth, percent, result, resultOutput;
      // #. Get the per month, percent and the total from the inputs
      // The values are passed through parseInt so the interpreter will not
      // try any funny business with the numbers and treat them like ints
      perMonth = parseInt(this.$('[name="per_month"]').val(), 10);
      percent = parseInt(this.$('[name="percent"]').val(), 10);
      currentTotal = parseInt(this.$('[name="current_total"]').val(), 10);
      // #. Update the result div with details
      if (perMonth && percent && currentTotal) {
        result = this.how_long(currentTotal, percent, perMonth);
        resultOutput = `<div class="months" >Months: ${result.count}</div><div class="interest" >Total Interest: ${result.interest}</div>`;
        return this.$('[data-elem="results"]').html(resultOutput);
      }
    }

  };

  DebtExperimentView.prototype.events = {
    'click [data-action="close"]': 'close',
    'click [data-action="calculate"]': 'calculate'
  };

  DebtExperimentView.prototype.autoRender = true;

  DebtExperimentView.prototype.template = template;

  template = null;

  return DebtExperimentView;

}).call(this);
});

;require.register("scripts/views/experiment/gravatar_experiment.coffee", function(exports, require, module) {
var $, Backbone, GravatarExperimentView, View, template,
  boundMethodCheck = function(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new Error('Bound instance method accessed before binding'); } };

View = require('scripts/views/base/view');

template = require('templates/experiments/gravatar');

Backbone = require('backbone');

$ = require('jquery');

Backbone.$ = $;

// **GravatarExperiment** is a simple experiment to display the gravatar based on an email
// to test out a way to make a profile registration
module.exports = GravatarExperimentView = (function() {
  class GravatarExperimentView extends View {
    constructor() {
      super(...arguments);
      this.changeAvatar = this.changeAvatar.bind(this);
    }

    changeAvatar(e) {
      var avatarEl, emailAddress, imageUrl;
      boundMethodCheck(this, GravatarExperimentView);
      if ((emailAddress = $(e.currentTarget).val())) {
        imageUrl = `http://www.gravatar.com/avatar/${md5(emailAddress)}.jpg?s=80&d=https://d1vk1po2s93fx0.cloudfront.net/assets/info/avatar-empty-f47c5c13282838f4afa0d2dc90acb42a.png`;
        avatarEl = this.$('#avatar');
        avatarEl.empty();
        return avatarEl.append(`<img src="${imageUrl}" />`);
      }
    }

  };

  GravatarExperimentView.prototype.events = {
    'click [data-action="close"]': 'close',
    'change [data-elem="email"]': 'changeAvatar'
  };

  GravatarExperimentView.prototype.autoRender = true;

  GravatarExperimentView.prototype.template = template;

  template = null;

  return GravatarExperimentView;

}).call(this);
});

;require.register("scripts/views/experiment/hello_experiment.coffee", function(exports, require, module) {
var HelloExperimentView, View, template,
  boundMethodCheck = function(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new Error('Bound instance method accessed before binding'); } };

View = require('scripts/views/base/view');

template = require('templates/experiments/hello_world');

// **HelloExperiment** is a simple experiment just to get a mini experimental site working with lab like projects.
// Using [Docco](http://jashkenas.github.com/docco/) to generate the documentation.
//   docco src/*.coffee
module.exports = HelloExperimentView = (function() {
  class HelloExperimentView extends View {
    constructor() {
      super(...arguments);
      this.afterRender = this.afterRender.bind(this);
    }

    getTemplateData() {
      return {
        name: 'world'
      };
    }

    afterRender() {
      var container;
      boundMethodCheck(this, HelloExperimentView);
      container = this.$('[data-elem="sketch-on-me"]')[0];
      this.ctx = Sketch.create({
        container: container,
        autoclear: false,
        autostart: false
      });
      this.ctx.width = 800;
      this.ctx.height = 250;
      this.ctx.draw = () => {
        this.ctx.beginPath();
        this.ctx.arc(random(this.ctx.width), random(this.ctx.height), 3, 0, TWO_PI);
        this.ctx.fillStyle = '#776d6b';
        return this.ctx.fill();
      };
      return this.ctx.start();
    }

    remove() {
      super.remove();
      this.ctx.stop();
      return this.ctx.clear();
    }

  };

  HelloExperimentView.prototype.events = {
    'click [data-action="close"]': 'close'
  };

  HelloExperimentView.prototype.autoRender = true;

  HelloExperimentView.prototype.template = template;

  template = null;

  return HelloExperimentView;

}).call(this);
});

;require.register("scripts/views/experiment/pos_experiment.coffee", function(exports, require, module) {
var $, Backbone, PosExperimentView, View, _, template;

View = require('scripts/views/base/view');

template = require('templates/experiments/pos');

Backbone = require('backbone');

$ = require('jquery');

_ = require('underscore');

Backbone.$ = $;

// **Parts of Speech parsing** is an experiment involving parts of speech
module.exports = PosExperimentView = (function() {
  class PosExperimentView extends View {
    // Grabs the first verb
    firstVerb(taggedWords) {
      var i, len, tag, taggedWord, word;
      for (i = 0, len = taggedWords.length; i < len; i++) {
        taggedWord = taggedWords[i];
        word = taggedWord[0];
        tag = taggedWord[1];
        if (_.include(['PP', 'VB', 'VBN'], tag)) {
          return word;
        }
      }
    }

    // Grabs the first set of nouns in sequence
    firstNouns(taggedWords) {
      var i, len, nouns, tag, taggedWord, word;
      nouns = "";
      for (i = 0, len = taggedWords.length; i < len; i++) {
        taggedWord = taggedWords[i];
        word = taggedWord[0];
        tag = taggedWord[1];
        if (_.include(['NN', 'NNS', 'NNP'], tag)) {
          nouns += ` ${word}`;
        } else if (nouns.length > 1) {
          return nouns;
        }
      }
      return nouns;
    }

    // Gets a random value from a list
    randomListItem(list) {
      var idx, max;
      max = list.length;
      idx = Math.floor(Math.random() * max);
      return list[idx];
    }

    questionResponse(taggedWords) {
      var nouns, response, responses, verb;
      verb = this.firstVerb(taggedWords);
      nouns = this.firstNouns(taggedWords);
      if (verb && (responses = this.questionReponses[verb.toLowerCase()]) && (response = this.randomListItem(responses))) {
        return response.text(nouns);
      } else {
        return `Looks like you might be asking a question about ${nouns}?`;
      }
    }

    taskResponse(taggedWords) {
      var nouns, response, responses, verb;
      verb = this.firstVerb(taggedWords);
      nouns = this.firstNouns(taggedWords);
      if (verb && (responses = this.taskReponses[verb.toLowerCase()]) && (response = this.randomListItem(responses))) {
        return response.text(nouns);
      } else {
        return `Do you need to do something related to ${nouns}?`;
      }
    }

    // Main method to analyze text
    analyze(e) {
      var firstTag, firstWord, i, len, resultOutput, tag, taggedWord, taggedWords, textValue, word, words;
      // Get the text from the description field
      textValue = this.$('[name="description"]').val();
      // #. Update the result div with analysis
      if (textValue) {
        words = new Lexer().lex(textValue);
        taggedWords = new POSTagger().tag(words);
        resultOutput = "";
        firstWord = taggedWords[0];
        firstTag = firstWord[1];
        if (_.include(['WRB', 'WP', 'WDT', 'VBP'], firstTag)) {
          resultOutput += `<div class="type" >${this.questionResponse(taggedWords)}<br /></div>`;
        } else if (_.include(['PP', 'VB', 'VBN'], firstTag)) {
          resultOutput += `<div class="type" >${this.taskResponse(taggedWords)}<br /></div>`;
        } else if ('PRP' === firstTag) { // Also need PDT for all, both, etc... / analyze all
          resultOutput += "<div class=\"type\" >Need to communicate someone for this? <br /></div>";
        }
// TODO analyze the contents based on combination of tags to determine actions
// TODO analyze verb and determine the subject after that
// Also determine content based on verb / preposition and Proper Noun
        for (i = 0, len = taggedWords.length; i < len; i++) {
          taggedWord = taggedWords[i];
          word = taggedWord[0];
          tag = taggedWord[1];
          resultOutput += `<div class="pos-item" >Word: ${word}, TAG: ${tag}</div>`;
        }
        return this.$('[data-elem="results"]').html(resultOutput);
      }
    }

  };

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
          return `Sometimes I eat ${noun}`;
        },
        emotion: 1
      },
      {
        text: function(noun) {
          return `Eating ${noun} is not very healthy`;
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
      },
      {
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
          return `Why do you want to call ${noun}?`;
        },
        emotion: 1
      },
      {
        text: function(noun) {
          return `You still like ${noun}?`;
        },
        emotion: 1
      }
    ],
    make: [
      {
        text: function(noun) {
          return `Do you really think I can make ${noun}?`;
        },
        emotion: 1
      },
      {
        text: function(noun) {
          return `If I could make ${noun} I wouldn't be here`;
        },
        emotion: 1
      },
      {
        text: function(noun) {
          return `I can only do so much. You could make your own ${noun}`;
        },
        emotion: 1
      }
    ]
  };

  return PosExperimentView;

}).call(this);
});

;require.register("scripts/views/experiment/simple_box_experiment.coffee", function(exports, require, module) {
var SimpleBoxExperimentView, View, template,
  boundMethodCheck = function(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new Error('Bound instance method accessed before binding'); } };

View = require('scripts/views/base/view');

template = require('templates/experiments/simple_box');

// **Box Physics Experiment** is a simple experiment just to get used to threejs and physijs.
module.exports = SimpleBoxExperimentView = (function() {
  class SimpleBoxExperimentView extends View {
    constructor() {
      super(...arguments);
      this.renderScene = this.renderScene.bind(this);
      this.addShape = this.addShape.bind(this);
      this.afterRender = this.afterRender.bind(this);
    }

    initialize() {
      var thirdPartyRoot;
      super.initialize();
      thirdPartyRoot = window.base_path || '';
      Physijs.scripts.worker = `${thirdPartyRoot}/third-party/physijs_worker.js`;
      return Physijs.scripts.ammo = `${thirdPartyRoot}/third-party/ammo.js`;
    }

    addLight() {
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
    }

    initScene() {
      var container, height, width;
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
      this.scene.addEventListener('update', () => {
        return this.scene.simulate(void 0, 2);
      });
      this.camera = new THREE.PerspectiveCamera(35, width / height, 1, 1000);
      this.camera.position.set(50, 10, 50);
      this.camera.lookAt(this.scene.position);
      this.scene.add(this.camera);
      // Box
      this.box = new Physijs.BoxMesh(new THREE.CubeGeometry(50, 2, 50), new THREE.MeshBasicMaterial({
        color: 0x888888
      }), 0); // mass
      this.box.receiveShadow = true;
      this.scene.add(this.box);
      this.addLight();
      return requestAnimationFrame(this.renderScene);
    }

    renderScene() {
      boundMethodCheck(this, SimpleBoxExperimentView);
      this.scene.simulate(); // run physics
      this.renderer.render(this.scene, this.camera); // render the scene
      return requestAnimationFrame(this.renderScene);
    }

    addShape() {
      var material, shape;
      boundMethodCheck(this, SimpleBoxExperimentView);
      material = Physijs.createMaterial(new THREE.MeshLambertMaterial({
        opacity: 1,
        transparent: true
      }), 0.6, 0.3); // Friction // restitution
      shape = new Physijs.BoxMesh(new THREE.CubeGeometry(3, 3, 3), material);
      shape.material.color.setRGB(Math.random() * 100 / 100, Math.random() * 100 / 100, Math.random() * 100 / 100);
      shape.castShadow = true;
      shape.receiveShadow = true;
      shape.position.set(Math.random() * 30 - 15, 20, Math.random() * 30 - 15);
      shape.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      return this.scene.add(shape);
    }

    afterRender() {
      boundMethodCheck(this, SimpleBoxExperimentView);
      return this.initScene();
    }

  };

  SimpleBoxExperimentView.prototype.events = {
    'click [data-action="close"]': 'close',
    'click [data-elem="sketch-on-me"]': 'addShape'
  };

  SimpleBoxExperimentView.prototype.autoRender = true;

  SimpleBoxExperimentView.prototype.template = template;

  template = null;

  return SimpleBoxExperimentView;

}).call(this);
});

;require.register("scripts/views/site-view.coffee", function(exports, require, module) {
var SiteView, View, template;

View = require('scripts/views/base/view');

template = require('templates/layouts/main');

module.exports = SiteView = (function() {
  class SiteView extends View {};

  SiteView.prototype.container = '#main';

  SiteView.prototype.id = 'site-container';

  SiteView.prototype.regions = {
    main: '#content',
    experiment: '#experiment'
  };

  SiteView.prototype.template = template;

  template = null;

  return SiteView;

}).call(this);
});

;require.register("templates/experiment_row.hbs", function(exports, require, module) {
var __templateData = Handlebars.template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<a href=\"/experiments/"
    + alias4(((helper = (helper = lookupProperty(helpers,"id") || (depth0 != null ? lookupProperty(depth0,"id") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data,"loc":{"start":{"line":1,"column":22},"end":{"line":1,"column":28}}}) : helper)))
    + "\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":1,"column":30},"end":{"line":1,"column":38}}}) : helper)))
    + "</a> "
    + alias4(((helper = (helper = lookupProperty(helpers,"description") || (depth0 != null ? lookupProperty(depth0,"description") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data,"loc":{"start":{"line":1,"column":43},"end":{"line":1,"column":58}}}) : helper)));
},"useData":true});
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

;require.register("templates/experiments/css-transition-fun.hbs", function(exports, require, module) {
var __templateData = Handlebars.template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"modal experiment-modal\">\n<div class=\"modal-header\"><h3>Css Transition fun</h3>\n  <a class=\"experiment-close\" data-action=\"close\">x</a>\n</div>\n<div class=\"modal-body\"><p>\n   Expanding Css transition box\n   <input type=\"text\" class=\"expanding-input\" />\n</p></div>\n<div class=\"modal-footer\"><a data-action=\"docs\" href=\"docs/css-transition-fun.html\" data-bypass=\"true\">Documentation</a></div>\n</div>\n<div class=\"modal-backdrop experiment-backdrop\"></div>\n</div>\n";
},"useData":true});
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

;require.register("templates/experiments/debt.hbs", function(exports, require, module) {
var __templateData = Handlebars.template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<!-- TODO make snippets for handlebars? -->\n<div class=\"modal experiment-modal\">\n    <div class=\"modal-header\"><h3>Debt is evil</h3>\n        <a class=\"experiment-close\" data-action=\"close\">x</a>\n    </div>\n    <div class=\"modal-body\">\n        <div class=\"calculator\">\n        <p>\n        <label>Per month:</label><input type=\"text\" name=\"per_month\" />\n        </p>\n        <p>\n        <label>Percentage:</label><input type=\"text\" name=\"percent\" />%\n        </p>\n        <p>\n        <label>Current Balance:</label><input type=\"text\" name=\"current_total\" />\n        </p>\n        <p>\n          <button data-action=\"calculate\" >Calculate</button>\n        </p>\n        </div>\n        <div class=\"calc-results\" data-elem=\"results\"></div>\n    </div>\n    <div class=\"modal-footer\"><a data-action=\"docs\" href=\"docs/debt_experiment.html\" data-bypass=\"true\">Documentation</a></div>\n</div>\n<div class=\"modal-backdrop experiment-backdrop\"></div>\n</div>\n";
},"useData":true});
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

;require.register("templates/experiments/gravatar.hbs", function(exports, require, module) {
var __templateData = Handlebars.template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"modal experiment-modal\">\n<div class=\"modal-header\"><h3>Gravatar Experiment</h3>\n  <a class=\"experiment-close\" data-action=\"close\">x</a>\n</div>\n<div class=\"modal-body\"><p>\n    <p>\n    Email address: <input type=\"email\" data-elem=\"email\" />\n    </p>\n    <div id=\"avatar\">\n    </div>\n</p></div>\n<div class=\"modal-footer\"><a data-action=\"docs\" href=\"docs/gravatar_experiment.html\" data-bypass=\"true\">Documentation</a></div>\n</div>\n<div class=\"modal-backdrop experiment-backdrop\"></div>\n</div>\n";
},"useData":true});
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

;require.register("templates/experiments/hello_world.hbs", function(exports, require, module) {
var __templateData = Handlebars.template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"modal experiment-modal\">\n<div class=\"modal-header\"><h3>Hello "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"name","hash":{},"data":data,"loc":{"start":{"line":2,"column":36},"end":{"line":2,"column":44}}}) : helper)))
    + "!</h3>\n  <a class=\"experiment-close\" data-action=\"close\">x</a>\n</div>\n<div class=\"modal-body\"><p>\n    This is the first experiment to work out the structure of the loading and starting of experiments\n    <div data-elem=\"sketch-on-me\">\n\n    </div>\n</p></div>\n<div class=\"modal-footer\"><a data-action=\"docs\" href=\"docs/hello_experiment.html\" data-bypass=\"true\">Documentation</a></div>\n</div>\n<div class=\"modal-backdrop experiment-backdrop\"></div>\n</div>\n";
},"useData":true});
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

;require.register("templates/experiments/pos.hbs", function(exports, require, module) {
var __templateData = Handlebars.template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<!-- TODO make snippets for handlebars? -->\n<div class=\"modal experiment-modal\">\n    <div class=\"modal-header\"><h3>Parts of Speech Analysis</h3>\n        <a class=\"experiment-close\" data-action=\"close\">x</a>\n    </div>\n    <div class=\"modal-body\">\n        <div class=\"calculator\">\n            <p>\n                <label>Enter some text:</label><textarea name=\"description\" ></textarea>\n            </p>\n            <p>\n                <button data-action=\"analyze\" >Analyze</button>\n            </p>\n        </div>\n        <div class=\"calc-results\" data-elem=\"results\"></div>\n    </div>\n    <div class=\"modal-footer\"><a data-action=\"docs\" href=\"docs/pos_experiment.html\" data-bypass=\"true\">Documentation</a></div>\n</div>\n<div class=\"modal-backdrop experiment-backdrop\"></div>\n</div>\n";
},"useData":true});
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

;require.register("templates/experiments/simple_box.hbs", function(exports, require, module) {
var __templateData = Handlebars.template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"modal experiment-modal\">\n    <div class=\"modal-header\"><h3>Simple Box Physics!</h3>\n        <a class=\"experiment-close\" data-action=\"close\">x</a>\n    </div>\n    <div class=\"modal-body\">\n        <div data-elem=\"sketch-on-me\">\n        </div>\n    </div>\n    <div class=\"modal-footer\"><a data-action=\"docs\" href=\"docs/simple_box_experiment.html\" data-bypass=\"true\">Documentation</a></div>\n</div>\n<div class=\"modal-backdrop experiment-backdrop\"></div>\n</div>\n";
},"useData":true});
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

;require.register("templates/layouts/main.hbs", function(exports, require, module) {
var __templateData = Handlebars.template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<section id=\"content\" class=\"content\"></section>\n<aside id=\"experiment\" class=\"secondary\"></aside>\n";
},"useData":true});
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

;require.alias("exoskeleton", "backbone");require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=app.js.map