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
//bloques del nivel intanciar variable
let groupBlock;

//modelos 3D
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import level_1_model from "../../assets/Level1.gltf";

export default class ThreeScene {
  constructor() {
    //cargar modelo 3D
    // Instancia del cargador GLTFLoader
    this.GLTFLoader = new GLTFLoader();
    this.GLTFLoader.load(level_1_model, (gltf) => {
      this.levelModel = gltf.scene;
      this.levelModel.position.set(0.5, -1.2, -20);
      this.levelModel.scale.set(10, 10, 10);
      this.levelModel.rotation.set(0, Math.PI * 0.5, 0);
      this.scene.add(this.levelModel);
      this.physics.add.existing(this.levelModel, {
        shape: "concaveMesh",
        addChildren: true,
        collisionFlags: 2,
      });
    });
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
    this.physics.debug?.enable();

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
    backLimmits.body.setCollisionFlags(4); // Establecer como un "fantasma" // Evitar colisiones
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
    var finnishLimit = this.physics.add.box(
      {
        x: 0.05,
        y: -3,
        z: -140,
        width: 20,
        height: 50,
        depth: 1,
      },
      { standard: { color: 0xf2a0e2 } }
    );
    finnishLimit.body.setCollisionFlags(5);

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

    //control de coliciones :
    //suelo

    //groupBlock

    //limites
    player.body.on.collision((collidedObject, event) => {
      if (collidedObject === bottomLimmits) {
        console.log("me cai");
      } else if (collidedObject === backLimmits) {
        console.log("en la pared");
      } else if (collidedObject === finnishLimit) {
        console.log("llegue a la meta");
      }
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
      player.body.setVelocityZ(-1);
      finnishLimit.body.setVelocityZ(50);
      //groupBlock.body.setPosition(0, 0, 5);
      if (this.levelModel) {
        this.levelModel.position.z += 0.02;
        this.levelModel.body.needUpdate = true;
      }

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

  createLevelBlocks() {}
}

// '/ammo' is the folder where all ammo file are
PhysicsLoader("/ammo", () => {
  const threeScene = new ThreeScene();
});
