# The routes for the application. This module returns a function.
# `match` is match method of the Router

module.exports = (match) ->
  unless match  
    return
  match '', 'experiment#index'
  match '/', 'experiment#index'
  match 'experiments/:id',  'experiment#show'
  match '/experiments/:id',  'experiment#show'