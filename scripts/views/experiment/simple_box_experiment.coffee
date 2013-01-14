# **Box Physics Experiment** is a simple experiment just to get used to threejs and physijs.
define ["backbone", "libs/physi", "libs/three.min"], (Backbone, PhysiModule, ThreeModule) ->
  class Views.SimpleBoxExperimentView extends Backbone.View

    events:
      'click [data-action="close"]' : 'close'
      'click [data-elem="sketch-on-me"]': 'addShape'

    # Tells backbone layout manager to manage the view
    manage: true

    # Used by layout manager to append a '.html' to find it
    # via the relative path of app + below
    template: 'templates/experiments/simple_box'

    # Simple initializer
    initialize: (opts) ->
      # Collection var isn't set auto magically
      @collection = opts.collection
      super



    addLight: ->
      light = new THREE.DirectionalLight( 0xFFFFFF )
      light.position.set( 20, 40, -15 )
      light.target.position.copy( @scene.position )
      light.castShadow = true
      light.shadowCameraLeft = -60
      light.shadowCameraTop = -60
      light.shadowCameraRight = 60
      light.shadowCameraBottom = 60
      light.shadowCameraNear = 20
      light.shadowCameraFar = 200
      light.shadowBias = -0.0001
      light.shadowMapWidth = light.shadowMapHeight = 2048
      light.shadowDarkness = 0.7
      @scene.add( light )

    initScene: ->
      container = @$('[data-elem="sketch-on-me"]')[0]
      width = 650
      height = 450

      @renderer = new THREE.WebGLRenderer
        antialias: true
      @renderer.setSize( width, height )
      @renderer.shadowMapEnabled = true
      @renderer.shadowMapSoft = true

      container.appendChild( @renderer.domElement )

      @scene = new Physijs.Scene()
      #  fixedTimeStep: 1 / 120
      @scene.setGravity(new THREE.Vector3( 0, -30, 0 ))
      @scene.addEventListener(
        'update',
        =>
          @scene.simulate( undefined, 2 )
      )

      @camera = new THREE.PerspectiveCamera(
        35,
        width / height,
        1,
        1000
      )
      @camera.position.set( 50, 10, 50 )
      @camera.lookAt( @scene.position )
      @scene.add( @camera )

      # Box
      @box = new Physijs.BoxMesh(
        new THREE.CubeGeometry( 50, 2, 50 ),
        new THREE.MeshBasicMaterial({ color: 0x888888 }),
        0 # mass
      )
      @box.receiveShadow = true
      @scene.add( @box )
      @addLight()
      requestAnimationFrame( @renderScene )


    renderScene: =>
      @scene.simulate() # run physics
      @renderer.render( @scene, @camera) # render the scene
      requestAnimationFrame( @renderScene )

    addShape: =>
      material = Physijs.createMaterial(
        new THREE.MeshLambertMaterial({ opacity: 1, transparent: true }),
        0.6, # Friction
        0.3 # restitution
      )
      #material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping
      #material.map.repeat.set( 0.5, 0.5 )

      shape = new Physijs.BoxMesh(new THREE.CubeGeometry( 3, 3, 3 ), material)
      shape.material.color.setRGB( Math.random() * 100 / 100, Math.random() * 100 / 100, Math.random() * 100 / 100 )
      shape.castShadow = true
      shape.receiveShadow = true
      shape.position.set(
        Math.random() * 30 - 15,
        20,
        Math.random() * 30 - 15
      )
      shape.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      )
      @scene.add( shape )
      # new TWEEN.Tween(shape.material).to({opacity: 1}, 500).start()


    html: (root, el) =>
      $('#experiment').empty()
      $(root).html(el)

      'use strict'
      Physijs.scripts.worker = '../scripts/libs/physijs_worker.js'
      Physijs.scripts.ammo = '../libs/ammo.js'


      @initScene()

    close: (e) ->
      @
      @remove()
      Backbone.history.navigate('/',true)