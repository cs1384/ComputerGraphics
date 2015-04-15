if(!Detector.webgl) Detector.addGetWebGLMessage();

var container;
var camera, scene, renderer;
var controls;
var raycaster;

var objects = []
var particles, geometry, materials = [], parameters, i, h, color, size;
var treasures = [];
var ball;

var mouseX = 0;
var mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var moveForward = false;
var moveBackward = false;
var moveRight = false;
var moveLeft = false;

var prevTime = performance.now();
var velocity = new THREE.Vector3();

var blocker = document.getElementById( 'blocker' );
var instructions = document.getElementById( 'instructions' );
// http://www.html5rocks.com/en/tutorials/pointerlock/intro/
var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if ( havePointerLock ) {
   var element = document.body;

   var pointerlockchange = function ( event ) {
      if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
         controlsEnabled = true;
         controls.enabled = true;
         blocker.style.display = 'none';
      } else {
         controls.enabled = false;
         blocker.style.display = '-webkit-box';
         blocker.style.display = '-moz-box';
         blocker.style.display = 'box';
         instructions.style.display = '';
      }
   }

   var pointerlockerror = function ( event ) {
      instructions.style.display = '';
   }

   // Hook pointer lock state change events
   document.addEventListener( 'pointerlockchange', pointerlockchange, false );
   document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
   document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

   document.addEventListener( 'pointerlockerror', pointerlockerror, false );
   document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
   document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

   instructions.addEventListener( 'click', function ( event ) {
      instructions.style.display = 'none';
      // Ask the browser to lock the pointe
      element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
      if ( /Firefox/i.test( navigator.userAgent ) ) {
         var fullscreenchange = function ( event ) {
            if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {
               document.removeEventListener( 'fullscreenchange', fullscreenchange );
               document.removeEventListener( 'mozfullscreenchange', fullscreenchange );
               element.requestPointerLock();
            }
         }
         document.addEventListener( 'fullscreenchange', fullscreenchange, false );
         document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );
         element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
         element.requestFullscreen();
      } else {
         element.requestPointerLock();
      }
   }, false );
} else {
   instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
}

document.addEventListener( 'mousemove', onDocumentMouseMove, false );
init();
animate();

function onDocumentMouseMove( event ) {
   mouseX = ( event.clientX - windowHalfX ) * 0.10;
   mouseY = ( event.clientY - windowHalfY ) * 0.10;
}

var controlsEnabled = false;

function init() {

   container = document.getElementById( 'homework' );
   //container = document.createElement( 'div' );
   //document.body.appendChild( container );

   scene = new THREE.Scene();

   camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
   camera.position.set( 4, 2, 4 );
   scene.add(camera);

   controls = new THREE.PointerLockControls( camera );
   scene.add( controls.getObject() );

   raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

   // GRID
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
   scene.add( line );

    // LIGHT

   var light = new THREE.DirectionalLight(0xffffff);
   light.position.set(1,1,1).normalize();
   scene.add(light);

   // OBJECTS

   var material = new THREE.MeshNormalMaterial();        
   ball = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 20), material);
   ball.position.set(1,1,1);
   scene.add(ball);
   objects.push(ball);

   for(var i=0;i<4;i++){
      treasures[i] = new THREE.Mesh( new THREE.TetrahedronGeometry( 2, 1 ), material );
      objects.push(treasures[i]);
   }
   treasures[0].position.set( -28.5, 2, -28.5);
   treasures[1].position.set( -28.5, 2, 28.5);
   treasures[2].position.set( 28.5, 2, -28.5);
   treasures[3].position.set( 28.5, 2, 28.5);
   for(var i=0;i<4;i++) scene.add( treasures[i] );

   // PARTICLE

   geometry = new THREE.Geometry();

   for ( i = 0; i < 2000; i ++ ) {

      var vertex = new THREE.Vector3();
      vertex.x = Math.random() * 2000 - 1000;
      vertex.y = Math.random() * 2000 - 1000;
      vertex.z = Math.random() * 2000 - 1000;

      geometry.vertices.push( vertex );

   }

   parameters = [
      [ [1, 1, 0.5], 5 ],
      [ [0.95, 1, 0.5], 4 ],
      [ [0.90, 1, 0.5], 3 ],
      [ [0.85, 1, 0.5], 2 ],
      [ [0.80, 1, 0.5], 1 ]
   ];

   for ( i = 0; i < parameters.length; i ++ ) {

      color = parameters[i][0];
      size  = parameters[i][1];

      materials[i] = new THREE.PointCloudMaterial( { size: size } );

      particles = new THREE.PointCloud( geometry, materials[i] );

      particles.rotation.x = Math.random() * 6;
      particles.rotation.y = Math.random() * 6;
      particles.rotation.z = Math.random() * 6;

      scene.add( particles );

   }

   //

   var onKeyDown = function ( event ) {

               switch ( event.keyCode ) {

                  case 38: // up
                  case 87: // w
                     moveForward = true;
                     break;

                  case 37: // left
                  case 65: // a
                     moveLeft = true; break;

                  case 40: // down
                  case 83: // s
                     moveBackward = true;
                     break;

                  case 39: // right
                  case 68: // d
                     moveRight = true;
                     break;

                  case 32: // space
                     if ( canJump === true ) velocity.y += 350;
                     canJump = false;
                     break;

               }

            };

            var onKeyUp = function ( event ) {

               switch( event.keyCode ) {

                  case 38: // up
                  case 87: // w
                     moveForward = false;
                     break;

                  case 37: // left
                  case 65: // a
                     moveLeft = false;
                     break;

                  case 40: // down
                  case 83: // s
                     moveBackward = false;
                     break;

                  case 39: // right
                  case 68: // d
                     moveRight = false;
                     break;

               }

            };

            document.addEventListener( 'keydown', onKeyDown, false );
            document.addEventListener( 'keyup', onKeyUp, false );

   // RENDERER
   
   renderer = new THREE.WebGLRenderer( { alpha: true } );
   renderer.setSize( window.innerWidth, window.innerHeight);
   container.appendChild( renderer.domElement );

    //

   window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {
   windowHalfX = window.innerWidth / 2,
   windowHalfY = window.innerHeight / 2,

   camera.aspect = window.innerWidth / window.innerHeight;
   camera.updateProjectionMatrix();

   renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
   requestAnimationFrame( animate );
   if ( controlsEnabled ) {
               raycaster.ray.origin.copy( controls.getObject().position );
               raycaster.ray.origin.y -= 10;

               var intersections = raycaster.intersectObjects( objects );

               var isOnObject = intersections.length > 0;

               var time = performance.now();
               var delta = ( time - prevTime ) / 1000;

               velocity.x -= velocity.x * 10.0 * delta;
               velocity.z -= velocity.z * 10.0 * delta;

               velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

               if ( moveForward ) velocity.z -= 400.0 * delta;
               if ( moveBackward ) velocity.z += 400.0 * delta;

               if ( moveLeft ) velocity.x -= 400.0 * delta;
               if ( moveRight ) velocity.x += 400.0 * delta;

               if ( isOnObject === true ) {
                  velocity.y = Math.max( 0, velocity.y );

                  canJump = true;
               }

               controls.getObject().translateX( velocity.x * delta );
               controls.getObject().translateY( velocity.y * delta );
               controls.getObject().translateZ( velocity.z * delta );

               if ( controls.getObject().position.y < 10 ) {

                  velocity.y = 0;
                  controls.getObject().position.y = 10;

                  canJump = true;

               }

               prevTime = time;

            }
   render();
}

var clock = new THREE.Clock();

function render() {

   // BALL

   var timer = 0.001 * Date.now();
   ball.rotation.x = -timer;
   ball.rotation.z = Math.PI/2;
   ball.position.x = camera.position.x;
   ball.position.y = camera.position.y;
   
   /*
   if(moveForward && ball.position.x<=29) ball.position.x += .5;
   if(moveBackward && ball.position.x>=-29) ball.position.x -= .5;
   if(moveRight && ball.position.z<=29) ball.position.z += .5;
   if(moveLeft && ball.position.z>=-29) ball.position.z -= .5;
   */

   // TREATURES

   for(var i=0;i<4;i++){
      //treasures[i].rotation.z = time;
      treasures[i].position.y = Math.abs(2-timer*10%4)+2;
   }
   
   // CAMERA 

   //camera.position.y += ( - mouseY - camera.position.y ) * .05;
   //camera.lookAt( ball.position );

   //var timer = Date.now() * 0.0005;
   //camera.position.x = Math.cos( timer ) * 10;
    //camera.position.y = 3;
   //camera.position.z = ball.rotation.z;
   //camera.lookAt( scene.position );
   
   //camera.position.x += ( mouseX - camera.position.x ) * .05;
   //camera.position.y += ( - mouseY - camera.position.y ) * .05;
   //camera.position.x = ball.position.x;
   //camera.position.z = ball.position.z;
   //camera.lookAt( ball.position );
   
   // PARTICLE

   var time = 0.00001 * Date.now();
   for ( i = 0; i < scene.children.length; i ++ ) {
      var object = scene.children[ i ];
      if ( object instanceof THREE.PointCloud ) {
         object.rotation.y = time * ( i < 4 ? i + 1 : - ( i + 1 ) );
      }
   }
   for ( i = 0; i < materials.length; i ++ ) {
      color = parameters[i][0];
      h = ( 360 * ( color[0] + time ) % 360 ) / 360;
      materials[i].color.setHSL( h, color[1], color[2] );
   }

   //cameraCube.rotation.copy( camera.rotation );
   //renderer.render( sceneCube, cameraCube );
   renderer.render( scene, camera );
}