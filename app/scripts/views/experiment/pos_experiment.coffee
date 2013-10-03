View = require 'scripts/views/base/view'
template = require 'templates/experiments/pos'

# **Parts of Speech parsing** is an experiment involving parts of speech
module.exports = class PosExperimentView extends View

  events:
    'click [data-action="analyze"]'     : 'analyze'

  autoRender: true

  template: template
  template = null

  questionReponses:
    eat: [
      {
        text: (noun) -> "Sometimes I eat #{noun}",
        emotion: 1
      },
      {
        text: (noun) -> "Eating #{noun} is not very healthy",
        emotion: 1
      }
    ]
    read: [
      {
      text: (noun) -> "Well I'm reading your question right now",
      emotion: 1
      },
      {
      text: (noun) -> "I read parts of speech mostly",
      emotion: 1
      }
    ]

  taskReponses:
    call: [
      {
        text: (noun) -> "Why do you want to call #{noun}?",
        emotion: 1
      },
      {
        text: (noun) -> "You still like #{noun}?",
        emotion: 1
      }
    ]
    make: [
      {
      text: (noun) -> "Do you really think I can make #{noun}?",
      emotion: 1
      },
      {
      text: (noun) -> "If I could make #{noun} I wouldn't be here",
      emotion: 1
      },
      {
      text: (noun) -> "I can only do so much. You could make your own #{noun}",
      emotion: 1
      }
    ]

  # Grabs the first verb
  firstVerb: (taggedWords) ->
    for taggedWord in taggedWords
      word = taggedWord[0]
      tag = taggedWord[1]
      if _.include(['PP','VB', 'VBN'], tag)
        return word

  # Grabs the first set of nouns in sequence
  firstNouns: (taggedWords) ->
    nouns = ""
    for taggedWord in taggedWords
      word = taggedWord[0]
      tag = taggedWord[1]
      if _.include(['NN','NNS', 'NNP'], tag)
        nouns += " #{word}"
      else if nouns.length > 1
        return nouns
    nouns

  # Gets a random value from a list
  randomListItem: (list) ->
    max = list.length
    idx = Math.floor(Math.random() * max)
    list[idx]

  questionResponse: (taggedWords) ->
    verb = @firstVerb(taggedWords)
    nouns = @firstNouns(taggedWords)
    if verb && (responses = @questionReponses[verb.toLowerCase()]) && (response = @randomListItem(responses))
      response.text(nouns)
    else
      "Looks like you might be asking a question about #{nouns}?"

  taskResponse: (taggedWords) ->
    verb = @firstVerb(taggedWords)
    nouns = @firstNouns(taggedWords)
    if verb && (responses = @taskReponses[verb.toLowerCase()]) && (response = @randomListItem(responses))
        response.text(nouns)
    else
      "Do you need to do something related to #{nouns}?"

  # Main method to analyze text
  analyze: (e) ->
    # Get the text from the description field
    textValue = @$('[name="description"]').val()
    # #. Update the result div with analysis
    if textValue
      words = new Lexer().lex(textValue)
      taggedWords = new POSTagger().tag(words)
      resultOutput = ""
      firstWord = taggedWords[0]
      firstTag = firstWord[1]
      if _.include(['WRB','WP','WDT', 'VBP'], firstTag)
        resultOutput += "<div class=\"type\" >#{@questionResponse(taggedWords)}<br /></div>"
      else if _.include(['PP','VB', 'VBN'], firstTag)
        resultOutput += "<div class=\"type\" >#{@taskResponse(taggedWords)}<br /></div>"
      else if 'PRP' == firstTag  # Also need PDT for all, both, etc... / analyze all
        resultOutput += "<div class=\"type\" >Need to communicate someone for this? <br /></div>"
      # TODO analyze the contents based on combination of tags to determine actions
      # TODO analyze verb and determine the subject after that
      # Also determine content based on verb / preposition and Proper Noun
      for taggedWord in taggedWords
        word = taggedWord[0]
        tag = taggedWord[1]
        resultOutput += "<div class=\"pos-item\" >Word: #{word}, TAG: #{tag}</div>"
      @$('[data-elem="results"]').html(resultOutput)