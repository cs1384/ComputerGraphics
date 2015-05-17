if(!Detector.webgl) Detector.addGetWebGLMessage();

// BASIC

var container;
var camera, scene, renderer;

// OBJECT

var particles, geometry, materials = [], parameters, i, h, color, pSize;
var treasures = [];
var ball;

// GRID PARAMETER

var size = 45, step = 3;
var len = size*2/step-1
var grid = new Array(len)

// FIRST PERSON CONTROL
// http://www.html5rocks.com/en/tutorials/pointerlock/intro/

var controls;
var controlBall;
var raycaster;
var objects = []

var controlsEnabled = false;

var moveForward = false;
var moveBackward = false;
var moveRight = false;
var moveLeft = false;

var prevTime = performance.now();
var velocity = new THREE.Vector3();

// GAMING CONTROL

var count = 0;
var level = 1;

// MONSTERS

var characters = [];
var ctrl = {
   moveForward: false,
   moveBackward: false,
   moveLeft: false,
   moveRight: false
};
var directions = []


// ENTERING MODE

var blocker = document.getElementById( 'blocker' );
var instructions = document.getElementById( 'instructions' );
var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if ( havePointerLock ) {
   var element = document.body;
   var pointerlockchange = function ( event ) {
      if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
         controlsEnabled = true;
         controls.enabled = true;
         controlBall.enabled = true;
         blocker.style.display = 'none';
      } else {
         controls.enabled = false;
         controlBall.enabled = false;
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

// FIRE 

init();
animate();

function init() {

   container = document.getElementById( 'homework' );
   //container = document.createElement( 'div' );
   //document.body.appendChild( container );

   scene = new THREE.Scene();

   camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
   camera.position.set( 0, 1, 12 );
   scene.add(camera);

   controls = new THREE.PointerLockControls( camera );
   scene.add( controls.getObject() );
   //objects.push(camera);

   raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

   // VIRTUAL GRID

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

   // REAL GRID

   var xStart = - size - step/2
   for (var i=0;i<len;i++){
      xStart += step
      var zStart = - size - step/2 
      grid[i] = new Array(len)
      for (var j=0;j<grid[i].length;j++){
         zStart += step
         grid[i][j] = new THREE.Vector3( xStart, - 0.1, zStart )
      }
   }

   // LIGHT

   var light = new THREE.DirectionalLight(0xffffff);
   light.position.set(1,1,1).normalize();
   scene.add(light);

   // BALL

   var material = new THREE.MeshNormalMaterial();         
   ball = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16), material);
   ball.position.set(0,0,1);
   //scene.add(ball);
   //objects.push(ball);
   controlBall = new THREE.PointerLockControls3( ball );
   scene.add( controlBall.getObject() );

   // TREASURES

   var idx = Math.floor(Math.random()*(len*len));
   treasure = new THREE.Mesh( new THREE.TetrahedronGeometry( 2, 1 ), material );
   var pos = grid[Math.floor(idx/len)][idx%len];
   treasure.position.set(pos.x, pos.y, pos.z);
   scene.add(treasure)

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
      pSize  = parameters[i][1];

      materials[i] = new THREE.PointCloudMaterial( { pSize: pSize } );

      particles = new THREE.PointCloud( geometry, materials[i] );

      particles.rotation.x = Math.random() * 6;
      particles.rotation.y = Math.random() * 6;
      particles.rotation.z = Math.random() * 6;

      scene.add( particles );

   }

   // MONSTERS
   
   var config = {
      baseUrl: "models/ratamahatta/",
      body: "ratamahatta.js",
      skins: [ "ratamahatta.png", "ctf_b.png", "ctf_r.png", "dead.png", "gearwhore.png" ],
      weapons:  [  [ "weapon.js", "weapon.png" ],
                [ "w_bfg.js", "w_bfg.png" ],
                [ "w_blaster.js", "w_blaster.png" ],
                [ "w_chaingun.js", "w_chaingun.png" ],
                [ "w_glauncher.js", "w_glauncher.png" ],
                [ "w_hyperblaster.js", "w_hyperblaster.png" ],
                [ "w_machinegun.js", "w_machinegun.png" ],
                [ "w_railgun.js", "w_railgun.png" ],
                [ "w_rlauncher.js", "w_rlauncher.png" ],
                [ "w_shotgun.js", "w_shotgun.png" ],
                [ "w_sshotgun.js", "w_sshotgun.png" ]
               ]
   };

   for ( var i = 0; i < 3; i ++ ) {
      var character = new THREE.MD2Character();
      character.scale = .7+level*.2;
      characters.push( character );
   }

   var baseCharacter = new THREE.MD2Character();
   baseCharacter.scale = .7+level*.2;
   baseCharacter.onLoadComplete = function () {
      //baseCharacter.setSkin(2);
      var k = 0;
      var divide = size*2/(3+1);
      for ( var i = 0; i < 3; i ++ ) {
         var cloneCharacter = characters[ k ];
         cloneCharacter.shareParts( baseCharacter );
         cloneCharacter.setSkin(i);
         cloneCharacter.setAnimation('run');
         if(i==0){
            cloneCharacter.root.position.x = -size +38
            cloneCharacter.root.position.z = -size +7;
         }else if(i==1){
            cloneCharacter.root.position.x = -size +13
            cloneCharacter.root.position.z = size +25;
         }else{
            cloneCharacter.root.position.x = size+42
            cloneCharacter.root.position.z = -size +30;
         }
         var dir = new THREE.Vector3();
         dir.x = cloneCharacter.root.position.x;
         dir.y = cloneCharacter.root.position.y;
         dir.z = cloneCharacter.root.position.z;
         directions.push(dir);
         scene.add( cloneCharacter.root );
         k++;
      }
      alert('Giant are comming!');
   };

   baseCharacter.loadParts( config );

   // KEY EVENTS

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
            if ( canJump === true ) velocity.y += 250;
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

   // SITUATION OF WINDOW RESIZE

   window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {
   camera.aspect = window.innerWidth / window.innerHeight;
   camera.updateProjectionMatrix();
   renderer.setSize( window.innerWidth, window.innerHeight );
}


function animate() {
   requestAnimationFrame( animate );
   var time = performance.now();
   var delta = ( time - prevTime ) / 1000;

   if ( controlsEnabled ) {
      raycaster.ray.origin.copy( controls.getObject().position );
      raycaster.ray.origin.y -= 10;

      var intersections = raycaster.intersectObjects( objects );

      var isOnObject = intersections.length > 0;

      //var time = performance.now();
      //var delta = ( time - prevTime ) / 1000;

      velocity.x -= velocity.x * 10.0 * delta;
      velocity.z -= velocity.z * 10.0 * delta;

      velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

      // DECIDE MOVING VELOCITY

      if ( moveForward ) velocity.z -= 300.0 * delta;
      if ( moveBackward ) velocity.z += 300.0 * delta;
      if ( moveLeft ) velocity.x -= 300.0 * delta;
      if ( moveRight ) velocity.x += 300.0 * delta;

      if ( isOnObject === true ) {
         velocity.y = Math.max( 0, velocity.y );
         canJump = true;
      }


      // CHANGE POSITION OF CONTROLLED OBJECT 

      controls.getObject().translateX( velocity.x * delta );
      controls.getObject().translateY( velocity.y * delta );
      controls.getObject().translateZ( velocity.z * delta );

      // BALL
      controlBall.getObject().translateX( velocity.x * delta );
      controlBall.getObject().translateY( velocity.y * delta );
      controlBall.getObject().translateZ( velocity.z * delta );

      // BOUNDARA SETTING

      if ( controls.getObject().position.y < 2 ) {
         velocity.y = 0;
         controls.getObject().position.y = 2;
         canJump = true;
      }
      if ( controlBall.getObject().position.y < 1.1 ) {
         velocity.y = 0;
         controlBall.getObject().position.y = 1.1;
         canJump = true;
      }
      
      // grid
      if ( controls.getObject().position.x < - size ) {
         velocity.x = 0;
         controls.getObject().position.x = - size;
         controlBall.getObject().position.x = - size;
      }
      if ( controls.getObject().position.x > size ) {
         velocity.x = 0;
         controls.getObject().position.x = size;
         controlBall.getObject().position.x = size;
      }
      if ( controlBall.getObject().position.z < -size ) {
         velocity.z = 0;
         controls.getObject().position.z = -size;
         controlBall.getObject().position.z = -size;
      }
      if ( controlBall.getObject().position.z > size ) {
         velocity.z = 0;
         controls.getObject().position.z = size;
         controlBall.getObject().position.z = size;
      }

      prevTime = time;
   }

   //character.update( delta*.2 );
   //ctrl.moveRight = true;
   //ctrl.moveForward = true;
   var i = 0;
   for (i = 0; i < 1; i ++ ) {
      var mul = Math.floor(Math.random()*15);
      var point = new THREE.Vector3();
      point.x = controlBall.getObject().position.x;
      point.y = characters[i].root.position.y
      point.z = controlBall.getObject().position.z;
      characters[i].root.lookAt(point);
      characters[i].root.translateX( delta*mul );
      characters[i].root.translateZ( delta*mul );
      characters[i].update( delta*.5 );
   }

   for(;i<2;i++){
      var mul = Math.floor(Math.random()*7);
      var point = new THREE.Vector3();
      point.x = -controlBall.getObject().position.x;
      point.y = characters[i].root.position.y
      point.z = controlBall.getObject().position.z;
      characters[i].root.lookAt(point);
      characters[i].root.translateX( delta*2*mul );
      characters[i].root.translateZ( delta*2*mul );
      characters[i].update( delta*.2*mul );
   }

   for(;i<3;i++){
      var mul = Math.floor(Math.random()*12);
      var point = new THREE.Vector3();
      point.x = controlBall.getObject().position.x;
      point.y = characters[i].root.position.y
      point.z = -controlBall.getObject().position.z;
      characters[i].root.lookAt(point);
      characters[i].root.translateX( delta*mul );
      characters[i].root.translateZ( delta*mul );
      characters[i].update( delta*.1*mul );
   }


   var rayDir = new THREE.Vector3(0,1,0);
   var caster = new THREE.Raycaster();
   caster.far = 3;
   caster.set(controlBall.getObject().position, rayDir);
   for ( var i = 0; i < characters.length; i ++ ) {
      var collisions = caster.intersectObjects(characters[i].root.children);
      if(collisions.length>0 && ball.position.y<10){
         var m = new THREE.Matrix4();
         m.makeScale(.9,.9,.9);
         ball.applyMatrix(m);
         //alert('Ouch');
      }
   }
   render();
}

var clock = new THREE.Clock();

function render() {

   // BALL ITSELF

   var timer1 = 0.01 * Date.now();
   if (moveForward){
      ball.rotation.x = -timer1;
      ball.rotation.z = Math.PI/2;
   } else if (moveBackward){
      ball.rotation.x = timer1;
      ball.rotation.z = Math.PI/2;
   } else if (moveLeft){
      //ball.rotation.z = timer1;
      ball.rotation.y = timer1;
      ball.rotation.x = Math.PI/2;
   } else if (moveRight){
      //ball.rotation.z = -timer1;
      ball.rotation.y = -timer1;
      ball.rotation.x = Math.PI/2;
   }

   // TREATURES

   var timer2 = 0.001 * Date.now();
   treasure.position.y = Math.abs(2-timer2*10%4)+2;
   /*
   for(var i=0;i<4;i++){
      treasures[i].position.y = Math.abs(2-timer2*10%4)+2;
   }
   */
   var xDiff = Math.abs(controlBall.getObject().position.x - treasure.position.x)
   var zDiff = Math.abs(controlBall.getObject().position.z - treasure.position.z)
   if (Math.sqrt(Math.pow(xDiff,2.0)+Math.pow(zDiff,2.0))<step/1.6 && controlBall.getObject().position.y<10){
      var idx = Math.floor(Math.random()*(len*len));
      var pos = grid[Math.floor(idx/len)][idx%len];
      treasure.position.set(pos.x, pos.y, pos.z);
      var m = new THREE.Matrix4();
      m.makeScale(1.1,1.1,1.1);
      ball.applyMatrix(m);
   }

   // CAMERA - handled by controller
   
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
   renderer.render( scene, camera );
}