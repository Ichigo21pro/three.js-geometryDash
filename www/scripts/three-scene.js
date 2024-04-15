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
  camera.position.set(37, 9, 84);
  camera.lookAt(0, 0, 0);

  // orbit controls
  var orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.minDistance = 10;
  orbitControls.maxDistance = 50;
  orbitControls.enablePan = true;

  // light
  scene.add(new THREE.HemisphereLight(0xffffbb, 0x080820, 1));
  scene.add(new THREE.AmbientLight(0x666666));
  const light = new THREE.DirectionalLight(0xdfebff, 1);
  light.position.set(50, 200, 100);
  light.position.multiplyScalar(1.3);

  // physics
  const physics = new AmmoPhysics(scene);
  physics.debug?.disable();

  // you can access Ammo directly if you want
  // new Ammo.btVector3(1, 2, 3).y()

  // extract the object factory from physics
  // the factory will make/add object without physics
  const { factory } = physics;
  // blue box
  const player = physics.add.box(
    { x: 0.05, y: 1, z: 98, width: 1, height: 1 },
    { lambert: { color: 0x2194ce } }
  );
  //camera target position
  // orbitControls.target = player.position;
  //blocks:
  let groupBlock = new THREE.Group();
  var block1 = physics.add.ground({
    x: 0.05,
    y: 1,
    z: 93,
    width: 1,
    width: 1,
    height: 5,
  });
  var block2 = physics.add.ground({
    x: 0.05,
    y: 2,
    z: 92,
    width: 1,
    width: 1,
    height: 3,
  });
  var block3 = physics.add.ground({
    x: 0.05,
    y: 3,
    z: 91,
    width: 1,
    width: 1,
    height: 1,
  });

  var block4 = physics.add.ground({
    x: 0.05,
    y: 3,
    z: 86,
    width: 3,
    width: 1,
    height: 3,
  });
  var block5 = physics.add.ground({
    x: 0.05,
    y: 3,
    z: 80,
    width: 1,
    width: 1,
    height: 3,
  });
  var block6 = physics.add.ground({
    x: 0.05,
    y: 2,
    z: 75,
    width: 1,
    width: 1,
    height: 3,
  });
  var block7 = physics.add.ground({
    x: 0.05,
    y: 5,
    z: 75,
    width: 1,
    width: 1,
    height: 3,
  });
  var block8 = physics.add.ground({
    x: 0.05,
    y: 1,
    z: 74,
    width: 1,
    width: 1,
    height: 1,
  });
  var block9 = physics.add.ground({
    x: 0.05,
    y: 2,
    z: 67,
    width: 1,
    width: 1,
    height: 7,
  });
  var block10 = physics.add.ground({
    x: 0.05,
    y: 1,
    z: 64,
    width: 1,
    width: 1,
    height: 1,
  });
  var block11 = physics.add.ground({
    x: 0.05,
    y: 2,
    z: 57,
    width: 1,
    width: 1,
    height: 7,
  });
  var block12 = physics.add.ground({
    x: 0.05,
    y: 3,
    z: 54,
    width: 1,
    width: 1,
    height: 1,
  });
  var block13 = physics.add.ground({
    x: 0.05,
    y: 1,
    z: 51,
    width: 1,
    width: 1,
    height: 1,
  });
  var block14 = physics.add.ground({
    x: 0.05,
    y: 1,
    z: 48,
    width: 1,
    width: 1,
    height: 1,
  });
  var block15 = physics.add.ground({
    x: 0.05,
    y: 1,
    z: 45,
    width: 1,
    width: 1,
    height: 1,
  });
  var block16 = physics.add.ground({
    x: 0.05,
    y: 1,
    z: 42,
    width: 1,
    width: 1,
    height: 1,
  });
  var block17 = physics.add.ground({
    x: 0.05,
    y: 2,
    z: 42,
    width: 1,
    width: 1,
    height: 1,
  });
  var block18 = physics.add.ground({
    x: 0.05,
    y: 1,
    z: 39,
    width: 1,
    width: 1,
    height: 1,
  });
  var block19 = physics.add.ground({
    x: 0.05,
    y: 2,
    z: 39,
    width: 1,
    width: 1,
    height: 1,
  });
  var block20 = physics.add.ground({
    x: 0.05,
    y: 3,
    z: 39,
    width: 1,
    width: 1,
    height: 1,
  });
  var block21 = physics.add.ground({
    x: 0.05,
    y: 3,
    z: 32,
    width: 1,
    width: 1,
    height: 8,
  });
  var block22 = physics.add.ground({
    x: 0.05,
    y: 3,
    z: 21,
    width: 1,
    width: 1,
    height: 8,
  });
  var block23 = physics.add.ground({
    x: 0.05,
    y: 1,
    z: 14,
    width: 1,
    width: 1,
    height: 1,
  });
  var block24 = physics.add.ground({
    x: 0.05,
    y: 2,
    z: 14,
    width: 1,
    width: 1,
    height: 1,
  });
  var block25 = physics.add.ground({
    x: 0.05,
    y: 3,
    z: 14,
    width: 1,
    width: 1,
    height: 1,
  });
  var block26 = physics.add.ground({
    x: 0.05,
    y: 1,
    z: 0,
    width: 1,
    width: 1,
    height: 18,
  });
  var block27 = physics.add.ground({
    x: 0.05,
    y: 2,
    z: -1.5,
    width: 1,
    width: 1,
    height: 15,
  });
  var block28 = physics.add.ground({
    x: 0.05,
    y: 3,
    z: -3,
    width: 1,
    width: 1,
    height: 12,
  });
  var block29 = physics.add.ground({
    x: 0.05,
    y: 4,
    z: -4.5,
    width: 1,
    width: 1,
    height: 9,
  });
  var block30 = physics.add.ground({
    x: 0.05,
    y: 5,
    z: -6,
    width: 1,
    width: 1,
    height: 6,
  });
  var block31 = physics.add.ground({
    x: 0.05,
    y: 6,
    z: -7.5,
    width: 1,
    width: 1,
    height: 3,
  });
  var block32 = physics.add.ground({
    x: 0.05,
    y: 6,
    z: -15,
    width: 1,
    width: 1,
    height: 8,
  });
  var block32 = physics.add.ground({
    x: 0.05,
    y: 5,
    z: -22,
    width: 1,
    width: 1,
    height: 6,
  });
  var block33 = physics.add.ground({
    x: 0.05,
    y: 5,
    z: -22,
    width: 1,
    width: 1,
    height: 6,
  });
  var block34 = physics.add.ground({
    x: 0.05,
    y: 4,
    z: -27,
    width: 1,
    width: 1,
    height: 4,
  });
  var block35 = physics.add.ground({
    x: 0.05,
    y: 3,
    z: -31,
    width: 1,
    width: 1,
    height: 4,
  });
  var block36 = physics.add.ground({
    x: 0.05,
    y: 2,
    z: -35,
    width: 1,
    width: 1,
    height: 4,
  });
  var block37 = physics.add.ground({
    x: 0.05,
    y: 1,
    z: -39,
    width: 1,
    width: 1,
    height: 4,
  });

  var block38 = physics.add.ground({
    x: 0.05,
    y: 1,
    z: -45,
    width: 1,
    width: 1,
    height: 1,
  });
  var block39 = physics.add.ground({
    x: 0.05,
    y: 1,
    z: -48,
    width: 1,
    width: 1,
    height: 1,
  });
  var block40 = physics.add.ground({
    x: 0.05,
    y: 1,
    z: -48,
    width: 1,
    width: 1,
    height: 1,
    depth: 4,
  });
  // static ground
  var grounBlock = physics.add.ground({ width: 3, height: 200 });
  //añadimos al grupo
  //groupBlock.add(grounBlock, block1, block2, block3);

  // this.add.existing(groupBlock);

  //physics.add.existing(groupBlock);

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
    //a: { pressed: false },
    //d: { pressed: false },
    //s: { pressed: false },
    //w: { pressed: false },
    space: { pressed: false },
  };
  var tocandoSuelo = false;

  //atrapamos las teclas
  window.addEventListener("keydown", (event) => {
    switch (event.code) {
      /*case "KeyA":
        keys.a.pressed = true;

        break;
      case "KeyD":
        keys.d.pressed = true;

        break;
      case "KeyW":
        keys.w.pressed = true;

        break;
      case "KeyS":
        keys.s.pressed = true;

        break;*/
      case "Space":
        // Realiza el salto.

        player.body.setVelocityY(5.5);

        break;
    }
  });
  player.body.on.collision((groupBlock, event) => {
    tocandoSuelo = true;
  });

  /*window.addEventListener("keyup", (event) => {
    switch (event.code) {
      case "KeyA":
        keys.a.pressed = false;

        break;
      case "KeyD":
        keys.d.pressed = false;

        break;
      case "KeyW":
        keys.w.pressed = false;

        break;
      case "KeyS":
        keys.s.pressed = false;

        break;
    }
  });*/

  ////////////////////////////////////////////////////////////////////////////////////

  // loop
  const animate = () => {
    physics.update(clock.getDelta() * 1000);
    physics.updateDebugger();
    ///////////////////////
    //camera
    orbitControls.update();

    ///////////////////////
    //para que no se mueva en el eje x y no gire
    player.body.setVelocityX(0);
    player.body.setAngularVelocityZ(0);
    player.body.setAngularVelocityY(0);
    //movimiento fijo eje z
    player.body.setVelocityZ(-4);

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

  const createLevelBlocks = () => {
    ///////
  };
};

// '/ammo' is the folder where all ammo file are
PhysicsLoader("/ammo", () => MainScene());
