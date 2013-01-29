var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["backbone", "libs/pos.tagger"], function(Backbone, POSTaggerModule) {
  return Views.PosExperimentView = (function(_super) {

    __extends(PosExperimentView, _super);

    function PosExperimentView() {
      return PosExperimentView.__super__.constructor.apply(this, arguments);
    }

    PosExperimentView.prototype.events = {
      'click [data-action="analyze"]': 'analyze'
    };

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

    PosExperimentView.prototype.manage = true;

    PosExperimentView.prototype.template = 'templates/experiments/pos';

    PosExperimentView.prototype.initialize = function(opts) {
      this.collection = opts.collection;
      return PosExperimentView.__super__.initialize.apply(this, arguments);
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

    PosExperimentView.prototype.html = function(root, el) {
      $('#experiment').empty();
      return $(root).html(el);
    };

    PosExperimentView.prototype.close = function(e) {
      this.remove();
      return Backbone.history.navigate('/', true);
    };

    return PosExperimentView;

  })(Backbone.View);
});
