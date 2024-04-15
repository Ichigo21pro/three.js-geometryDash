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

export default class ThreeScene {
  constructor() {
    // sizes
    const width = window.innerWidth;
    const height = window.innerHeight;

    // scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);

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
    orbitControls.enablePan = false;

    // light
    this.scene.add(new THREE.HemisphereLight(0xffffbb, 0x080820, 1));
    this.scene.add(new THREE.AmbientLight(0x666666));
    const light = new THREE.DirectionalLight(0xdfebff, 1);
    light.position.set(50, 200, 100);
    light.position.multiplyScalar(1.3);

    // physics
    this.physics = new AmmoPhysics(this.scene);
    this.physics.debug?.disable();

    // you can access Ammo directly if you want
    // new Ammo.btVector3(1, 2, 3).y()

    // extract the object factory from physics
    // the factory will make/add object without physics
    const { factory } = this.physics;
    // blue box
    const player = this.physics.add.box(
      { x: 0.05, y: 1, z: 98, width: 1, height: 1 },
      { lambert: { color: 0x2194ce } }
    );
    //camera target position
    orbitControls.target = player.position;
    //bloques del nivel
    this.createLevelBlocks();

    // static ground
    var grounBlock = this.physics.add.ground({ width: 3, height: 200 });
    //limits
    var backLimmits = this.physics.add.ground(
      {
        x: 0.05,
        y: 7,
        z: 110,
        width: 50,
        height: 1,
        depth: 20,
      },
      { standard: { color: 0xf2a0e2 } }
    );
    var bottomLimmits = this.physics.add.ground(
      {
        x: 0.05,
        y: -3,
        z: 85.5,
        width: 50,
        height: 50,
        depth: 2,
      },
      { standard: { color: 0xf2a0e2 } }
    );

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
      this.physics.update(clock.getDelta() * 1000);
      this.physics.updateDebugger();
      ///////////////////////
      //camera
      orbitControls.update();

      ///////////////////////
      //para que no se mueva en el eje x y no gire
      player.body.setVelocityX(0);
      player.body.setAngularVelocityZ(0);
      player.body.setAngularVelocityY(0);
      //movimiento fijo eje z
      //player.body.setVelocityZ(-4);
      groupBlock.body.setVelocityz(2);

      //////////////////////
      // you have to clear and call render twice because there are 2 scenes
      // one 3d scene and one 2d scene
      renderer.clear();
      renderer.render(this.scene, camera);
      renderer.clearDepth();
      renderer.render(scene2d, camera2d);

      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }

  createLevelBlocks() {
    //level blocks:
    let groupBlock = new THREE.Group();
    var block1 = this.physics.add.ground(
      {
        x: 0.05,
        y: 1,
        z: 93,
        width: 1,
        height: 5,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block2 = this.physics.add.ground(
      {
        x: 0.05,
        y: 2,
        z: 92,
        width: 1,
        height: 3,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block3 = this.physics.add.ground(
      {
        x: 0.05,
        y: 3,
        z: 91,
        width: 1,
        height: 1,
      },
      { standard: { color: 0xdcf2a0 } }
    );

    var block4 = this.physics.add.ground(
      {
        x: 0.05,
        y: 3,
        z: 86,
        width: 1,
        height: 3,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block5 = this.physics.add.ground(
      {
        x: 0.05,
        y: 3,
        z: 80,
        width: 1,
        height: 3,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block6 = this.physics.add.ground(
      {
        x: 0.05,
        y: 2,
        z: 75,
        width: 1,
        height: 3,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block7 = this.physics.add.ground(
      {
        x: 0.05,
        y: 5,
        z: 75,
        width: 1,
        height: 3,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block8 = this.physics.add.ground(
      {
        x: 0.05,
        y: 1,
        z: 74,
        width: 1,
        height: 1,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block9 = this.physics.add.ground(
      {
        x: 0.05,
        y: 2,
        z: 67,
        width: 1,
        height: 7,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block10 = this.physics.add.ground(
      {
        x: 0.05,
        y: 1,
        z: 64,
        width: 1,
        height: 1,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block11 = this.physics.add.ground(
      {
        x: 0.05,
        y: 2,
        z: 57,
        width: 1,
        height: 7,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block12 = this.physics.add.ground(
      {
        x: 0.05,
        y: 3,
        z: 54,
        width: 1,
        height: 1,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block13 = this.physics.add.ground(
      {
        x: 0.05,
        y: 1,
        z: 51,
        width: 1,
        height: 1,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block14 = this.physics.add.ground(
      {
        x: 0.05,
        y: 1,
        z: 48,
        width: 1,
        height: 1,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block15 = this.physics.add.ground(
      {
        x: 0.05,
        y: 1,
        z: 45,
        width: 1,
        height: 1,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block16 = this.physics.add.ground(
      {
        x: 0.05,
        y: 1,
        z: 42,
        width: 1,
        height: 1,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block17 = this.physics.add.ground(
      {
        x: 0.05,
        y: 2,
        z: 42,
        width: 1,
        height: 1,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block18 = this.physics.add.ground(
      {
        x: 0.05,
        y: 1,
        z: 39,
        width: 1,
        height: 1,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block19 = this.physics.add.ground(
      {
        x: 0.05,
        y: 2,
        z: 39,
        width: 1,
        height: 1,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block20 = this.physics.add.ground(
      {
        x: 0.05,
        y: 3,
        z: 39,
        width: 1,
        height: 1,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block21 = this.physics.add.ground(
      {
        x: 0.05,
        y: 3,
        z: 32,
        width: 1,
        height: 8,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block22 = this.physics.add.ground(
      {
        x: 0.05,
        y: 3,
        z: 21,
        width: 1,
        height: 8,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block23 = this.physics.add.ground(
      {
        x: 0.05,
        y: 1,
        z: 14,
        width: 1,
        height: 1,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block24 = this.physics.add.ground(
      {
        x: 0.05,
        y: 2,
        z: 14,
        width: 1,
        height: 1,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block25 = this.physics.add.ground(
      {
        x: 0.05,
        y: 3,
        z: 14,
        width: 1,
        height: 1,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block26 = this.physics.add.ground(
      {
        x: 0.05,
        y: 1,
        z: 0,
        width: 1,
        height: 18,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block27 = this.physics.add.ground(
      {
        x: 0.05,
        y: 2,
        z: -1.5,
        width: 1,
        height: 15,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block28 = this.physics.add.ground(
      {
        x: 0.05,
        y: 3,
        z: -3,
        width: 1,
        height: 12,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block29 = this.physics.add.ground(
      {
        x: 0.05,
        y: 4,
        z: -4.5,
        width: 1,
        height: 9,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block30 = this.physics.add.ground(
      {
        x: 0.05,
        y: 5,
        z: -6,
        width: 1,
        height: 6,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block31 = this.physics.add.ground(
      {
        x: 0.05,
        y: 6,
        z: -7.5,
        width: 1,
        height: 3,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block32 = this.physics.add.ground(
      {
        x: 0.05,
        y: 6,
        z: -15,
        width: 1,
        height: 8,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block33 = this.physics.add.ground(
      {
        x: 0.05,
        y: 5,
        z: -22,
        width: 1,
        height: 6,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block34 = this.physics.add.ground(
      {
        x: 0.05,
        y: 5,
        z: -22,
        width: 1,
        height: 6,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block35 = this.physics.add.ground(
      {
        x: 0.05,
        y: 4,
        z: -27,
        width: 1,
        height: 4,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block36 = this.physics.add.ground(
      {
        x: 0.05,
        y: 3,
        z: -31,
        width: 1,
        height: 4,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block37 = this.physics.add.ground(
      {
        x: 0.05,
        y: 2,
        z: -35,
        width: 1,
        height: 4,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block38 = this.physics.add.ground(
      {
        x: 0.05,
        y: 1,
        z: -39,
        width: 1,
        height: 4,
      },
      { standard: { color: 0xdcf2a0 } }
    );

    var block39 = this.physics.add.ground(
      {
        x: 0.05,
        y: 1,
        z: -45,
        width: 1,
        height: 1,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block40 = this.physics.add.ground(
      {
        x: 0.05,
        y: 1,
        z: -48,
        width: 1,
        height: 1,
        depth: 3,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block41 = this.physics.add.ground(
      {
        x: 0.05,
        y: 2,
        z: -51,
        width: 1,
        height: 1,
        depth: 4,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block42 = this.physics.add.ground(
      {
        x: 0.05,
        y: 2.5,
        z: -54,
        width: 1,
        height: 1,
        depth: 5.5,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block43 = this.physics.add.ground(
      {
        x: 0.05,
        y: 4,
        z: -57,
        width: 1,
        height: 1,
        depth: 7,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block44 = this.physics.add.ground(
      {
        x: 0.05,
        y: 5,
        z: -63,
        width: 1,
        height: 5,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block45 = this.physics.add.ground(
      {
        x: 0.05,
        y: 5,
        z: -71,
        width: 1,
        height: 5,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block46 = this.physics.add.ground(
      {
        x: 0.05,
        y: 5,
        z: -79,
        width: 1,
        height: 5,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block47 = this.physics.add.ground(
      {
        x: 0.05,
        y: 3.5,
        z: -84,
        width: 1,
        height: 1,
        depth: 6,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block48 = this.physics.add.ground(
      {
        x: 0.05,
        y: 3.5,
        z: -87,
        width: 1,
        height: 1,
        depth: 6,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var block49 = this.physics.add.ground(
      {
        x: 0.05,
        y: 3.5,
        z: -90,
        width: 1,
        height: 1,
        depth: 6,
      },
      { standard: { color: 0xdcf2a0 } }
    );
    var finalBlock = this.physics.add.ground(
      {
        x: 0.05,
        y: 7,
        z: -99,
        width: 1,
        height: 1,
        depth: 15,
      },
      { standard: { color: 0xf2a0e2 } }
    );

    //añadimos al grupo
    groupBlock.add(
      block1,
      block2,
      block3,
      block4,
      block5,
      block6,
      block7,
      block8,
      block9,
      block10,
      block11,
      block12,
      block13,
      block14,
      block15,
      block16,
      block17,
      block18,
      block19,
      block20,
      block21,
      block22,
      block23,
      block24,
      block25,
      block26,
      block27,
      block28,
      block29,
      block30,
      block31,
      block32,
      block33,
      block34,
      block35,
      block36,
      block37,
      block38,
      block39,
      block40,
      block41,
      block42,
      block43,
      block44,
      block45,
      block46,
      block47,
      block48,
      block49,
      finalBlock
    );
    this.scene.add(groupBlock);
    return groupBlock;
    //this.add.existing(groupBlock);
    //this.physics.add.existing(groupBlock);
  }
}

// '/ammo' is the folder where all ammo file are
PhysicsLoader("/ammo", () => {
  const threeScene = new ThreeScene();
});
