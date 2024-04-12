// three.js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// physics
import {
  AmmoPhysics,
  ExtendedMesh,
  PhysicsLoader,
} from "@enable3d/ammo-physics";

// CSG
import { CSG } from "@enable3d/three-graphics/jsm/csg";

// Flat
import { TextTexture, TextSprite } from "@enable3d/three-graphics/jsm/flat";

console.log("Three.js version r" + THREE.REVISION);

const MainScene = () => {
  // sizes
  const width = window.innerWidth;
  const height = window.innerHeight;

  // scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  // renderer
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  renderer.autoClear = false;
  document.body.appendChild(renderer.domElement);

  // dpr
  const DPR = window.devicePixelRatio;
  renderer.setPixelRatio(Math.min(2, DPR));

  // camera
  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
  camera.position.set(10, 10, 20);
  camera.lookAt(0, 0, 0);

  // orbit controls
  new OrbitControls(camera, renderer.domElement);

  // light
  scene.add(new THREE.HemisphereLight(0xffffbb, 0x080820, 1));
  scene.add(new THREE.AmbientLight(0x666666));
  const light = new THREE.DirectionalLight(0xdfebff, 1);
  light.position.set(50, 200, 100);
  light.position.multiplyScalar(1.3);

  // physics
  const physics = new AmmoPhysics(scene);
  physics.debug?.enable();

  // you can access Ammo directly if you want
  // new Ammo.btVector3(1, 2, 3).y()

  // extract the object factory from physics
  // the factory will make/add object without physics
  const { factory } = physics;
  // blue box
  const cube = physics.add.box(
    { x: 0.05, y: 10 },
    { lambert: { color: 0x2194ce } }
  );

  // static ground
  physics.add.ground({ width: 20, height: 20 });

  // add a normal sphere using the object factory
  // (NOTE: This will be factory.add.sphere() in the future)
  // first parameter is the config for the geometry
  // second parameter is for the material
  // you could also add a custom material like so { custom: new THREE.MeshLambertMaterial({ color: 0x00ff00 }) }

  // once the object is created, you can add physics to it

  // 2d camera/2d scene for UI
  const scene2d = new THREE.Scene();
  const camera2d = new THREE.OrthographicCamera(0, width, height, 0, 1, 1000);
  camera2d.position.setZ(10);

  // add 2d text in UI
  const text = new TextTexture("Score : ", {
    fontWeight: "bold",
    fontSize: 48,
  });
  const sprite = new TextSprite(text);
  const scale = 0.5;
  sprite.setScale(scale);
  sprite.setPosition(
    0 + (text.width * scale) / 2 + 12,
    height - (text.height * scale) / 2 - 12
  );
  scene2d.add(sprite);

  // clock
  const clock = new THREE.Clock();
  //////////////////////////////////////CONTROLS///////////////////////////////////////
  //para detectar cuando se deja de pulasr (si no el objeto se moveria aun despues de pulsar la tecla)
  const keys = {
    a: { pressed: false },
    d: { pressed: false },
    s: { pressed: false },
    w: { pressed: false },
    space: { pressed: false },
  };

  //atrapamos las teclas
  window.addEventListener("keydown", (event) => {
    switch (event.code) {
      case "KeyA":
        keys.a.pressed = true;

        break;
      case "KeyD":
        keys.d.pressed = true;

        break;
      case "KeyS":
        keys.w.pressed = true;

        break;
      case "KeyW":
        keys.s.pressed = true;

        break;
      case "Space":
        // Realiza el salto.
        cube.body.setVelocityY = 0.1;

        break;
    }
  });
  window.addEventListener("keyup", (event) => {
    switch (event.code) {
      case "KeyA":
        keys.a.pressed = false;

        break;
      case "KeyD":
        keys.d.pressed = false;

        break;
      case "KeyS":
        keys.w.pressed = false;

        break;
      case "KeyW":
        keys.s.pressed = false;

        break;
    }
  });

  ////////////////////////////////////////////////////////////////////////////////////

  // loop
  const animate = () => {
    physics.update(clock.getDelta() * 1000);
    physics.updateDebugger();
    ///////////////////////
    //hacer que no se mueva si no se toca nada
    //cube.velocity.x = 0;
    // cube.velocity.z = 0;
    //
    //movimiento del cubo eje x
    if (keys.a.pressed) {
      //  cube.velocity.x = -0.05;
    } else if (keys.d.pressed) {
      //  cube.velocity.x = +0.05;
    }
    //movimiento del cubo eje z
    if (keys.s.pressed) {
      //   cube.velocity.z = -0.05;
    } else if (keys.w.pressed) {
      //   cube.velocity.z = +0.05;
    }
    //////////////////////
    // you have to clear and call render twice because there are 2 scenes
    // one 3d scene and one 2d scene
    renderer.clear();
    renderer.render(scene, camera);
    renderer.clearDepth();
    renderer.render(scene2d, camera2d);

    requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);
};

// '/ammo' is the folder where all ammo file are
PhysicsLoader("/ammo", () => MainScene());
