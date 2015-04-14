window.time = 0;
var mouseX = 0;
var mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

document.addEventListener( 'mousemove', onDocumentMouseMove, false );


window.SimpleScene = function() {
   this.init = function(name) {
      this.scene = new THREE.Scene();

      // CREATE THE CAMERA, AND ATTACH IT TO THE SCENE.

      var camera = new THREE.PerspectiveCamera(50, 1, 1, 10000);
      camera.position.z = 5;
      this.scene.add(camera);

      // CREATE THE WEBGL RENDERER, AND ATTACH IT TO THE DOCUMENT BODY.

      var renderer = new THREE.WebGLRenderer( { alpha: true } );
      renderer.setSize(400, 400);
      document.getElementById(name).appendChild(renderer.domElement);

      // CALL THE USER'S SETUP FUNCTION JUST ONCE.

      this.setup();

      // START THE ANIMATION LOOP.

      var that = this;
      (function tick() {
         time = (new Date().getTime()) / 1000;
         that.update();
         renderer.render(that.scene, camera);
         requestAnimationFrame(tick);
      })();
   }
};

window.GameScene = function() {
   this.init = function(name) {
      this.scene = new THREE.Scene();

      // CREATE THE CAMERA, AND ATTACH IT TO THE SCENE.

      //var camera = new THREE.PerspectiveCamera(50, 1, 1, 10000);
      //camera.position.z = 5;

      //var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
      var camera = new THREE.PerspectiveCamera( 45, 900/500, 1, 2000 );
      camera.position.set( 2, 2, 3 );
      this.scene.add(camera);

      // grid

      var size = 30, step = 2;
      var geometry = new THREE.Geometry();
      var material = new THREE.LineBasicMaterial( { color: 0x303030 } );

      for ( var i = - size; i <= size; i += step ) {
         geometry.vertices.push( new THREE.Vector3( - size, - 0.1, i ) );
         geometry.vertices.push( new THREE.Vector3(   size, - 0.1, i ) );
         geometry.vertices.push( new THREE.Vector3( i, - 0.1, - size ) );
         geometry.vertices.push( new THREE.Vector3( i, - 0.1,   size ) );
      }

      var line = new THREE.Line( geometry, material, THREE.LinePieces );
      this.scene.add( line );

      // CREATE THE WEBGL RENDERER, AND ATTACH IT TO THE DOCUMENT BODY.

      var renderer = new THREE.WebGLRenderer( { alpha: true } );
      renderer.setSize( window.innerWidth-50, window.innerHeight-50);
      //renderer.setSize( window.innerWidth-50, 600);
      document.getElementById(name).appendChild(renderer.domElement);

      // CALL THE USER'S SETUP FUNCTION JUST ONCE.

      this.setup();

      // START THE ANIMATION LOOP.

      var that = this;
      (function tick() {
         var timer = Date.now() * 0.0005;
         //camera.position.x += ( mouseX - camera.position.x ) * .05;
         //camera.position.y += ( - mouseY - camera.position.y ) * .05;
         camera.position.x = Math.cos( timer ) * 10;
         camera.position.y = 2;
         camera.position.z = Math.sin( timer ) * 10;
         camera.lookAt( that.scene.position );

         time = (new Date().getTime()) / 1000;
         that.update();
         renderer.render(that.scene, camera);
         requestAnimationFrame(tick);
      })();
   }
};

function onDocumentMouseMove( event ) {
   mouseX = ( event.clientX - windowHalfX ) * 10;
   mouseY = ( event.clientY - windowHalfY ) * 10;
}

function evalElement(name) {
   eval(document.getElementById(name).innerHTML.replace(/<pre>/,'').replace(/<.pre>/,''));
}
