var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["backbone", "libs/physi", "libs/three.min"], function(Backbone, PhysiModule, ThreeModule) {
  return Views.SimpleBoxExperimentView = (function(_super) {

    __extends(SimpleBoxExperimentView, _super);

    function SimpleBoxExperimentView() {
      this.html = __bind(this.html, this);

      this.addShape = __bind(this.addShape, this);

      this.renderScene = __bind(this.renderScene, this);
      return SimpleBoxExperimentView.__super__.constructor.apply(this, arguments);
    }

    SimpleBoxExperimentView.prototype.events = {
      'click [data-action="close"]': 'close',
      'click [data-elem="sketch-on-me"]': 'addShape'
    };

    SimpleBoxExperimentView.prototype.manage = true;

    SimpleBoxExperimentView.prototype.template = 'templates/experiments/simple_box';

    SimpleBoxExperimentView.prototype.initialize = function(opts) {
      this.collection = opts.collection;
      return SimpleBoxExperimentView.__super__.initialize.apply(this, arguments);
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

    SimpleBoxExperimentView.prototype.html = function(root, el) {
      $('#experiment').empty();
      $(root).html(el);
      'use strict';

      Physijs.scripts.worker = '../scripts/libs/physijs_worker.js';
      Physijs.scripts.ammo = '../libs/ammo.js';
      return this.initScene();
    };

    SimpleBoxExperimentView.prototype.close = function(e) {
      this;
      this.remove();
      return Backbone.history.navigate('/', true);
    };

    return SimpleBoxExperimentView;

  })(Backbone.View);
});
