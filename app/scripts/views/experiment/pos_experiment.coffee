# **Parts of Speech parsing** is an experiment involving parts of speech
define ["backbone","libs/pos.tagger"], (Backbone, POSTaggerModule) ->
  class Views.PosExperimentView extends Backbone.View

    events:
      'click [data-action="analyze"]'     : 'analyze'

    # Tells backbone layout manager to manage the view
    manage: true

    # Used by layout manager to append a '.html' to find it
    # via the relative path of app + below
    template: 'templates/experiments/pos'


    initialize: (opts) ->
      @collection = opts.collection
      super

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
        if _.include(['WRB','WP','WDT'], firstTag)
          resultOutput += "<div class=\"type\" >Looks like you might be asking a question? <br /></div>"
        else if _.include(['PP','VB', 'VBN'], firstTag)
          resultOutput += "<div class=\"type\" >Do you need to do something? <br /></div>"
        else if 'PRP' == firstTag  # Also need PDT for all, both, etc...
          resultOutput += "<div class=\"type\" >Need to communicate someone for this? <br /></div>"

        for taggedWord in taggedWords
          word = taggedWord[0]
          tag = taggedWord[1]
          if tag == 'VB'
            # TODO analyze verb and determine the subject after that
            # Also determine content based on verb / preposition and Proper Noun
            console.log "Oh i see you want to #{word}"
          console.log(word + " /" + tag)
          resultOutput += "<div class=\"pos-item\" >Word: #{word}, TAG: #{tag}</div>"
        @$('[data-elem="results"]').html(resultOutput)


    # TODO move into common ExperimentView
    html: (root, el) ->
      $('#experiment').empty()
      $(root).html(el)

    # TODO move into common ExperimentView
    close: (e) ->
      @remove()
      Backbone.history.navigate('/',true)