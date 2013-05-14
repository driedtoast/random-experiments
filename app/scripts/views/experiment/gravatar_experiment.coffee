
# **GravatarExperiment** is a simple experiment to display the gravatar based on an email
# to test out a way to make a profile registration
define ["backbone", "libs/md5"], (Backbone, md5) ->
  class Views.GravatarExperimentView extends Backbone.View

    events:
      'click [data-action="close"]' : 'close'
      'change [data-elem="email"]'  : 'changeAvatar'

    # Tells backbone layout manager to manage the view
    manage: true

    # Used by layout manager to append a '.html' to find it
    # via the relative path of app + below
    template: 'templates/experiments/gravatar'

    # Simple initializer
    initialize: (opts) ->
      # Collection var isn't set auto magically
      @collection = opts.collection
      super

    html: (root, el) =>
      $('#experiment').empty()
      $(root).html(el)

    close: (e) ->
      @remove()
      Backbone.history.navigate('/',true)


    changeAvatar: (e) =>
      if (emailAddress = $(e.currentTarget).val())
        imageUrl = "http://www.gravatar.com/avatar/#{md5(emailAddress)}.jpg?s=80"
        avatarEl = @$('#avatar')
        avatarEl.empty()
        avatarEl.append "<img src=\"#{imageUrl}\" />"