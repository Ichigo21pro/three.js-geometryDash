// three.js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// Importa la clase Audio de Three.js

// physics
import {
  AmmoPhysics,
  ExtendedMesh,
  PhysicsLoader,
} from "@enable3d/ammo-physics";
import * as Ammo from "../ammo/ammo.js";

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
//
var mundoUNO;
var mundoDOS;
var mundoTRES;
//
var velocidadMUNDO = 0;
var velocidadFINISH = 0;
//
var mundoUNOTerminado = false;
var mundoDOSTerminado = false;

//modelos 3D
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import level_1_model from "../../assets/Level1.gltf";
import level_2_model from "../../assets/Level2.gltf";
import level_3_model from "../../assets/Level3.gltf";
import coinMoney from "../../assets/coin.gltf";

// Audio
import jumpSound from "../../assets/jump.mp3";

export default class ThreeScene {
  constructor() {
    // Instancia del cargador GLTFLoader
    this.GLTFLoader = new GLTFLoader();
    //
    ///////////////////////////////
    // Cargar modelo 3D del nivel
    this.GLTFLoader.load(level_1_model, (gltf) => {
      mundoUNO = gltf.scene;
      // Color
      // Recorremos todos los materiales del modelo
      mundoUNO.traverse((child) => {
        if (child.isMesh) {
          // Cambiamos el color del material
          child.material.color.set(0xff0000); // Cambia a tu color deseado en formato hexadecimal
        }
      });
      mundoUNO.position.set(0.5, -1.2, -20);
      mundoUNO.scale.set(10, 10, 10);
      mundoUNO.rotation.set(0, Math.PI * 0.5, 0);
      this.scene.add(mundoUNO);
      this.physics.add.existing(mundoUNO, {
        shape: "concaveMesh",
        addChildren: true,
        collisionFlags: 2,
      });
      // Llamar a la función createCoin con diferentes posiciones para crear múltiples monedas en el nivel
      this.createCoin(0, 5, 62, mundoUNO);
      this.createCoin(0, 3, 50.5, mundoUNO);
      this.createCoin(0, 5, 40, mundoUNO);
      this.createCoin(0, 5, 28.5, mundoUNO);
      this.createCoin(0, 5, 4.5, mundoUNO);
      this.createCoin(0, 6, -20, mundoUNO);
      this.createCoin(0, 6, -24, mundoUNO);
      this.createCoin(0, 1, -32, mundoUNO);
      this.createCoin(0, 4, -52.5, mundoUNO);
      this.createCoin(0, 11, -80.5, mundoUNO);

      velocidadMUNDO = 0.02;
      velocidadFINISH = 1.5;
    });
    ///////////////////////////////
    //"../../assets/jump.mp3"

    ///////////////////////////////
    this.GLTFLoader.load(level_2_model, (gltf) => {
      mundoDOS = gltf.scene;
      // Color
      // Recorremos todos los materiales del modelo
      mundoDOS.traverse((child) => {
        if (child.isMesh) {
          // Cambiamos el color del material
          child.material.color.set(0xff0000); // Cambia a tu color deseado en formato hexadecimal
        }
      });
      mundoDOS.position.set(0.5, -20 - 500, -20);
      mundoDOS.scale.set(10, 10, 10);
      mundoDOS.rotation.set(0, Math.PI * 0.5, 0);
      this.scene.add(mundoDOS);
      this.physics.add.existing(mundoDOS, {
        shape: "concaveMesh",
        addChildren: true,
        collisionFlags: 2,
      });
      // Llamar a la función createCoin con diferentes posiciones para crear múltiples monedas en el nivel
      this.createCoin(0, 5 - 20.5 - 500, 62, mundoDOS);
      this.createCoin(0, 3 - 20.5 - 500, 50.5, mundoDOS);
      this.createCoin(0, 5 - 20.5 - 500, 40, mundoDOS);
      this.createCoin(0, 5 - 20.5 - 500, 28.5, mundoDOS);
      this.createCoin(0, 5 - 20.5 - 500, 4.5, mundoDOS);
      this.createCoin(0, 5 - 20.5 - 500, -20, mundoDOS);
      this.createCoin(0, 5 - 20.5 - 500, -24, mundoDOS);
      this.createCoin(0, 3 - 20.5 - 500, -32, mundoDOS);
      this.createCoin(0, 4 - 20.5 - 500, -52.5, mundoDOS);
      this.createCoin(0, 11 - 20.5 - 500, -80.5, mundoDOS);

      velocidadMUNDO = 0.06;
      velocidadFINISH = 1;
    });
    //////////////////////////////////////////
    this.GLTFLoader.load(level_3_model, (gltf) => {
      mundoTRES = gltf.scene;
      // Color
      // Recorremos todos los materiales del modelo
      mundoTRES.traverse((child) => {
        if (child.isMesh) {
          // Cambiamos el color del material
          child.material.color.set(0xff0000); // Cambia a tu color deseado en formato hexadecimal
        }
      });
      mundoTRES.position.set(0.5, -20 - 500, -20);
      mundoTRES.scale.set(10, 10, 10);
      mundoTRES.rotation.set(0, Math.PI * 0.5, 0);
      this.scene.add(mundoTRES);
      this.physics.add.existing(mundoTRES, {
        shape: "concaveMesh",
        addChildren: true,
        collisionFlags: 2,
      });
      // Llamar a la función createCoin con diferentes posiciones para crear múltiples monedas en el nivel
      this.createCoin(0, 5 - 20.5 - 500, 61, mundoTRES);
      this.createCoin(0, 5 - 20.5 - 500, 49.5, mundoTRES);
      this.createCoin(0, 6 - 20.5 - 500, 42, mundoTRES);
      this.createCoin(0, 6 - 20.5 - 500, 30, mundoTRES);
      this.createCoin(0, 8 - 20.5 - 500, 8, mundoTRES);
      this.createCoin(0, 6 - 20.5 - 500, -15, mundoTRES);
      this.createCoin(0, 8 - 20.5 - 500, -25, mundoTRES);
      this.createCoin(0, 5 - 20.5 - 500, -32, mundoTRES);
      this.createCoin(0, 4 - 20.5 - 500, -52.5, mundoTRES);
      this.createCoin(0, 11 - 20.5 - 500, -80.5, mundoTRES);

      velocidadMUNDO = 0.08;
      velocidadFINISH = 4.5;
    });

    ///////////////////////////////
    //metemos los mundos en array
    this.levelData = [{ mundoUNO }, { mundoDOS }, { mundoTRES }];
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
    this.player = this.physics.add.box(
      { x: 0.05, y: 1, z: 98, width: 1, height: 1 },
      { lambert: { color: 0x2194ce } }
    );
    //camera target position
    orbitControls.target = this.player.position;

    ////////////////////
    // pariculas
    this.particleGeometry = new THREE.BufferGeometry();
    const positions = [];
    for (let i = 0; i < 100; i++) {
      const x = (Math.random() - 0.5) * 5;
      const y = Math.random() * 5;
      const z = (Math.random() - 0.5) * 5;
      positions.push(x, y, z);
    }
    this.particleGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    this.particleMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
    });
    this.particleSystem = new THREE.Points(
      this.particleGeometry,
      this.particleMaterial
    );
    this.scene.add(this.particleSystem);

    // Función para crear partículas
    this.createParticles = () => {
      this.particleSystem.position.set(
        this.player.position.x,
        this.player.position.y,
        this.player.position.z
      );

      const positions = this.particleGeometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] = (Math.random() - 0.5) * 5 /*this.player.position.x*/;
        positions[i + 1] = Math.random() * 5 /*this.player.position.y*/;
        positions[i + 2] = (Math.random() - 0.5) * 5 /*this.player.position.z*/;
      }
      this.particleGeometry.attributes.position.needsUpdate = true;
    };

    ///////////////////
    ///////////////////////////////
    //"../../assets/jump.mp3"

    // Crea un objeto AudioListener
    var listener = new THREE.AudioListener();
    this.player.add(listener);
    // Crea un nuevo objeto de audio
    var audioLoader = new THREE.AudioLoader();
    var self = this; // Guarda una referencia al contexto actual

    audioLoader.load(jumpSound, function (buffer) {
      self.audio = new THREE.Audio(listener); // Crea el objeto audio aquí
      self.audio.setBuffer(buffer);
      self.audio.setLoop(true);
      self.audio.setVolume(0.5);
    });
    ///////////////////////////////
    // static ground
    var grounBlock = this.physics.add.ground({ width: 1, height: 220 });
    //limits
    var backLimmits = this.physics.add.ground(
      {
        x: 0.05,
        y: 7,
        z: 210,
        width: 50,
        height: 200,
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
        height: 500,
        depth: 2,
      },
      { standard: { color: 0xf2a0e2 } }
    );
    var finnishLimit = this.physics.add.box(
      {
        x: 0.05,
        y: -3,
        z: -140 /*40*/,
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
            this.player.body.setVelocityY(5.5);
            this.createParticles();
            self.audio.setLoop(false);
            self.audio.play();
            tocandoSuelo = false;
          }

          break;
      }
    });

    //control de coliciones :
    //suelo

    //groupBlock

    //limites
    this.player.body.on.collision((collidedObject, event) => {
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
      } else if (collidedObject === finnishLimit && !mundoUNOTerminado) {
        nivel = 1;

        this.finnishLimit1 = this.physics.add.box(
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
        this.finnishLimit1.body.setCollisionFlags(4);

        mundoDOS.position.set(0.5, 0.5, -20);

        // Remover el mundo1 de la escena

        this.scene.remove(mundoUNO);
        this.scene.remove(finnishLimit);

        // Liberar memoria eliminando todas las referencias al mundoDos
        mundoUNO = null;
        mundoUNOTerminado = true;
      } else if (collidedObject === this.finnishLimit1 && !mundoDOSTerminado) {
        nivel = 2;

        this.finnishLimit2 = this.physics.add.box(
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
        this.finnishLimit2.body.setCollisionFlags(4);

        mundoDOS.position.set(0.5, -50, -20);

        mundoTRES.position.set(0.5, 0.5, -20);

        // Remover el mundoDos de la escena
        this.scene.remove(mundoDOS);
        this.scene.remove(finnishLimit2);
        //this.physics.destroy(mundoDOS);

        // Liberar memoria eliminando todas las referencias al mundoDos
        mundoDOS = null;
        finnishLimit2 = null;

        mundoDOSTerminado = true;
      }

      if (collidedObject === grounBlock) {
        tocandoSuelo = true;
      }

      if (collidedObject === mundoUNO) {
        tocandoSuelo = true;
      }
      if (collidedObject === mundoDOS) {
        tocandoSuelo = true;
      }
      if (collidedObject === mundoTRES) {
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
      }
      this.physics.update(clock.getDelta() * 1000);
      this.physics.updateDebugger();
      ///////////////////////
      //camera
      orbitControls.update();
      ///////////////////////
      //para que no se mueva en el eje x y no gire
      this.player.body.setVelocityX(0);
      this.player.body.setAngularVelocityZ(0);
      this.player.body.setAngularVelocityY(0);
      //movimiento fijo eje z
      this.player.body.setVelocityZ(-0.5);
      //movimiento del finnish
      finnishLimit.body.setVelocityZ(1.45); // Avanzar
      finnishLimit.body.setVelocityY(0.1); // No permitir que caiga por la gravedad
      //groupBlock.body.setPosition(0, 0, 5);
      if (nivel === 0) {
        if (mundoUNO) {
          mundoUNO.position.z += velocidadMUNDO;
          mundoUNO.body.needUpdate = true;

          monedas.forEach((coin) => {
            coin.body.needUpdate = true;
          });
        }
      } else if (nivel === 1) {
        if (mundoDOS) {
          mundoDOS.position.z += velocidadMUNDO;
          mundoDOS.body.needUpdate = true;
          monedas.forEach((coin) => {
            coin.body.needUpdate = true;
          });

          this.finnishLimit1.body.setVelocityZ(1.5); // Avanzar
          this.finnishLimit1.body.setVelocityY(0.3); // No permitir que caiga por la gravedad
          // Asegúrate de ajustar la lógica según sea necesario para mundoDOS
        }
      } else if (nivel === 2) {
        if (mundoTRES) {
          mundoTRES.position.z += velocidadMUNDO;
          mundoTRES.body.needUpdate = true;
          monedas.forEach((coin) => {
            coin.body.needUpdate = true;
          });

          this.finnishLimit2.body.setVelocityZ(1.5); // Avanzar
          this.finnishLimit2.body.setVelocityY(0.3); // No permitir que caiga por la gravedad
          // Asegúrate de ajustar la lógica según sea necesario para mundoTRES
        }
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

  createCoin(positionX, positionY, positionZ, mundo) {
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
      mundo.add(coin);
      monedas.push(coin);
      //////////////////////
    });
  }
}

// Load Ammo
Ammo().then(() => {
  const threeScene = new ThreeScene();
});
