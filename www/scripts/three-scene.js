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
//control limites
var tocoLimite = false;
var finDeJuego = false;
//niveles
var nivel = 0;
//
var tocandoSuelo = false;
//monedas
var contadorMonedas = 0;
//
var monedas = [];

//modelos 3D
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import level_1_model from "../../assets/Level1.gltf";
import coinMoney from "../../assets/coin.gltf";

export default class ThreeScene {
  constructor() {
    // Cargar modelo 3D del nivel
    // Instancia del cargador GLTFLoader
    this.GLTFLoader = new GLTFLoader();
    this.GLTFLoader.load(level_1_model, (gltf) => {
      this.levelModel = gltf.scene;
      // Color
      // Recorremos todos los materiales del modelo
      this.levelModel.traverse((child) => {
        if (child.isMesh) {
          // Cambiamos el color del material
          child.material.color.set(0xff0000); // Cambia a tu color deseado en formato hexadecimal
        }
      });
      this.levelModel.position.set(0.5, -1.2, -20);
      this.levelModel.scale.set(10, 10, 10);
      this.levelModel.rotation.set(0, Math.PI * 0.5, 0);
      this.scene.add(this.levelModel);
      this.physics.add.existing(this.levelModel, {
        shape: "concaveMesh",
        addChildren: true,
        collisionFlags: 2,
      });
      // Llamar a la función createCoin con diferentes posiciones para crear múltiples monedas en el nivel
      this.createCoin(0, 5, 62);
      this.createCoin(0, 3, 50.5);
      this.createCoin(0, 5, 40);
      this.createCoin(0, 5, 28.5);
      this.createCoin(0, 5, 4.5);
      this.createCoin(0, 6, -20);
      this.createCoin(0, 6, -24);
      this.createCoin(0, 1, -32);
      this.createCoin(0, 4, -52.5);
      this.createCoin(0, 11, -80.5);
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
    finnishLimit.body.setCollisionFlags(4);

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
    const text = new TextTexture("Score : " + contadorMonedas, {
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
      r: { pressed: false },
    };

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

        break;*/
        case "KeyR":
          keys.r.pressed = true;

          finDeJuego = false;
          window.location.reload(); // Recargar la página

          break;
        case "Space":
          // Realiza el salto.
          if (tocandoSuelo) {
            player.body.setVelocityY(5.5);
          }

          break;
      }
    });

    //control de coliciones :
    //suelo

    //groupBlock

    //limites
    player.body.on.collision((collidedObject, event) => {
      if (collidedObject === bottomLimmits) {
        // Mostrar mensaje en el centro de la cámara
        const gameOverText = new TextTexture(
          "Fin del juego. Presiona R para reiniciar",
          {
            fontWeight: "bold",
            fontSize: 48,
          }
        );
        const gameOverSprite = new TextSprite(gameOverText);
        gameOverSprite.setPosition(width / 2, height / 2);
        scene2d.add(gameOverSprite);

        // Detener la animación
        finDeJuego = true;
        return;
      } else if (collidedObject === backLimmits) {
        // Mostrar mensaje en el centro de la cámara
        const gameOverText = new TextTexture(
          "Fin del juego. Presiona R para reiniciar",
          {
            fontWeight: "bold",
            fontSize: 48,
          }
        );
        const gameOverSprite = new TextSprite(gameOverText);
        gameOverSprite.setPosition(width / 2, height / 2);
        scene2d.add(gameOverSprite);
        finDeJuego = true;
      } else if (collidedObject === finnishLimit) {
        nivel++;
      }

      if (collidedObject === grounBlock) {
        tocandoSuelo = true;
      }

      if (collidedObject === this.levelModel) {
        tocandoSuelo = true;
      }

      for (let i = 0; i < monedas.length; i++) {
        // console.log(monedas[i]);
        if (collidedObject === monedas[i]) {
          console.log("Colisión con moneda detectada");
          // Eliminar la moneda de la escena y del array
          monedas[i].position.y = -10;
          monedas[i].body.needUpdate = true;
          monedas.splice(i, 1);

          // Incrementar el contador de monedas recolectadas u realizar otras acciones
          contadorMonedas += 10;
          sprite.setText("Score : " + contadorMonedas);
          console.log("contadorMonedas:", contadorMonedas);
          // Salir del bucle ya que hemos encontrado la moneda colisionada
          break;
        }
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
    // Establecer un temporizador que ejecute la función cada 0.5 segundos
    setInterval(this.resetTocandoSuelo, 50); // 500 milisegundos = 0.5 segundos
    // loop
    const animate = () => {
      const animationID = requestAnimationFrame(animate);
      //controlar limites
      if (finDeJuego) {
        window.cancelAnimationFrame(animationID);
        /*
        // Congelar todo
        player.body.setVelocity(0, 0, 0);
        finnishLimit.body.setVelocity(0, 0, 0);
        monedas.forEach((coin) => coin.body.setVelocity(0, 0, 0));
        finnishLimit.body.setVelocityZ(0);
        this.levelModel.position.z += 0;
        this.levelModel.body.needUpdate = true;
        // Congelar todo
        player.body.setVelocity(0, 0, 0);
        finnishLimit.body.setVelocity(0, 0, 0);
        monedas.forEach((coin) => coin.body.setVelocity(0, 0, 0));*/
      }
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
      //movimiento del finnish
      finnishLimit.body.setVelocityZ(1.43); // Avanzar
      finnishLimit.body.setVelocityY(0.1); // No permitir que caiga por la gravedad
      //groupBlock.body.setPosition(0, 0, 5);
      if (this.levelModel) {
        this.levelModel.position.z += 0.02;
        this.levelModel.body.needUpdate = true;

        monedas.forEach((coin) => {
          coin.body.needUpdate = true;
        });
      }

      //controlar que este en el suelo

      //
      /////////////////////
      // you have to clear and call render twice because there are 2 scenes
      // one 3d scene and one 2d scene
      renderer.clear();
      renderer.render(this.scene, camera);
      renderer.clearDepth();
      renderer.render(scene2d, camera2d);
    };
    requestAnimationFrame(animate);
  }

  resetTocandoSuelo() {
    tocandoSuelo = false;
  }

  createCoin(positionX, positionY, positionZ) {
    // Cargar modelo 3D de la moneda
    this.GLTFLoader.load(coinMoney, (gltf) => {
      const coin = gltf.scene;
      // Color
      // Recorremos todos los materiales del modelo
      coin.traverse((child) => {
        if (child.isMesh) {
          // Cambiamos el color del material
          child.material.color.set(0xf7f748); // Cambia a tu color deseado en formato hexadecimal
        }
      });
      coin.position.set(positionX, positionY, positionZ); // Establecer posición usando parámetros
      coin.scale.set(2, 2, 2);
      coin.rotation.set(0, Math.PI * 0.5, 0);
      this.scene.add(coin);
      this.physics.add.existing(coin, {
        shape: "concaveMesh",
        addChildren: true,
        collisionFlags: 2,
      });
      // Agregar la moneda al nivel después de que haya sido cargada completamente
      this.levelModel.add(coin);
      monedas.push(coin);
      //////////////////////
    });
  }
}

// '/ammo' is the folder where all ammo file are
PhysicsLoader("/ammo", () => {
  const threeScene = new ThreeScene();
});
