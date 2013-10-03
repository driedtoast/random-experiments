View = require 'scripts/views/base/view'
md5 = require 'vendors/md5'
template = require 'templates/experiments/gravatar'

# **GravatarExperiment** is a simple experiment to display the gravatar based on an email
# to test out a way to make a profile registration
module.exports = class GravatarExperimentView extends View

  events:
    'click [data-action="close"]' : 'close'
    'change [data-elem="email"]'  : 'changeAvatar'

  autoRender: true
    
  template: template
  template = null
  

  # Simple initializer
  initialize: (opts) ->
    # Collection var isn't set auto magically
    @collection = opts.collection
    super

  changeAvatar: (e) =>
    if (emailAddress = $(e.currentTarget).val())
      imageUrl = "http://www.gravatar.com/avatar/#{md5(emailAddress)}.jpg?s=80&d=https://d1vk1po2s93fx0.cloudfront.net/assets/info/avatar-empty-f47c5c13282838f4afa0d2dc90acb42a.png"
      avatarEl = @$('#avatar')
      avatarEl.empty()
      avatarEl.append "<img src=\"#{imageUrl}\" />"