// three.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
// Importa la clase Audio de Three.js

// physics
import { AmmoPhysics, ExtendedMesh, PhysicsLoader } from '@enable3d/ammo-physics';
import * as Ammo from '../ammo/ammo.js';

// CSG
import { CSG } from '@enable3d/three-graphics/jsm/csg';

// Flat
import { TextTexture, TextSprite } from '@enable3d/three-graphics/jsm/flat';
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
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import level_1_model from '../../assets/Level1.gltf';
import level_2_model from '../../assets/Level2.gltf';
import level_3_model from '../../assets/Level3.gltf';
import coinMoney from '../../assets/coin.gltf';
import Stats from 'stats.js';
//particulas
import { BatchedRenderer, ParticleSystem } from 'three.quarks';
import { PointEmitter, IntervalValue, ConstantValue, ConstantColor, SizeOverLife, FrameOverLife, PiecewiseBezier, ColorOverLife, Bezier, AdditiveBlending, RenderMode, TextureLoader } from 'three.quarks';

// Audio
import jumpSound from '../../assets/jump.mp3';
import coinSound from '../../assets/coin.mp3';
import looseSound from '../../assets/loose.mp3';
import winSound from '../../assets/win.mp3';
// PArticles
import jumpParticle from '../../assets/particle.png';
//texture//
//rock
import tilesBaseDIFFI from '../../assets/texture/rock/Rock_04_DIFF.png';
import tilesBaseDISPI from '../../assets/texture/rock/Rock_04_DISP.png';
import tilesBaseNRMI from '../../assets/texture/rock/Rock_04_NRM.png';
import tilesBaseOCCI from '../../assets/texture/rock/Rock_04_OCC.png';
import tilesBaseSPECI from '../../assets/texture/rock/Rock_04_SPEC.png';
//gold
import tilesBaseGOLD from '../../assets/texture/gold/MetalGoldPaint002_COL_2K_METALNESS.png';
//wall
import tilesWallSombras from '../../assets/texture/wall/RoofShinglesOld002_AO_2K_METALNESS.png';
import tilesWallRelieve from '../../assets/texture/wall/RoofShinglesOld002_BUMP_2K_METALNESS.png';
import tilesWallColor from '../../assets/texture/wall/RoofShinglesOld002_COL_2K_METALNESS.png';
import tilesWallDesplazamiento from '../../assets/texture/wall/RoofShinglesOld002_DISP_2K_METALNESS.png';
import tilesWallDesplazamiento16 from '../../assets/texture/wall/RoofShinglesOld002_DISP16_2K_METALNESS.png';
import tilesWallMetalidad from '../../assets/texture/wall/RoofShinglesOld002_METALNESS_2K_METALNESS.png';
import tilesWallNormal from '../../assets/texture/wall/RoofShinglesOld002_NRM_2K_METALNESS.png';
import tilesWallRugosidad from '../../assets/texture/wall/RoofShinglesOld002_ROUGHNESS_2K_METALNESS.png';
//lava
import LavaTextura from '../../assets/texture/lava.png';
//laser
import LaserTextura from '../../assets/texture/laser.png';
//cubemap
import skyCubeMap from '../../assets/texture/cubemap/satara_night_1k.hdr';
//cubemap

///////////////

export default class ThreeScene {
  constructor() {
    // Instancia del cargador GLTFLoader
    this.GLTFLoader = new GLTFLoader();
    //
    ///////////////////////////////
    // Cargar modelo 3D del nivel
    this.GLTFLoader.load(level_1_model, (gltf) => {
      mundoUNO = gltf.scene;
      // Texture
      // Crear un nuevo material con las texturas aplicadas    //wall
      /* */

      // Recorremos todos los materiales del modelo
      mundoUNO.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({
            map: wallTextureColor, // Color map
            bumpMap: wallTextureRelieve, // Bump map
            bumpScale: 0.2, // Ajusta el valor según sea necesario
            normalMap: wallTextureNormal, // Normal map
            metalnessMap: wallTextureMetalidad, // Metalness map
            roughnessMap: wallTextureRugosidad, // Roughness map
            aoMap: wallTextureSombras, // Ambient Occlusion map
            displacementMap: wallTextureDespla16, // Displacement map
            displacementScale: 0, // Ajusta el valor según sea necesario
          });
        }
      });
      mundoUNO.position.set(0.5, -1.2, -20);
      mundoUNO.scale.set(10, 10, 10);
      mundoUNO.rotation.set(0, Math.PI * 0.5, 0);
      this.scene.add(mundoUNO);
      this.physics.add.existing(mundoUNO, {
        shape: 'concaveMesh',
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
          child.material = new THREE.MeshStandardMaterial({
            map: wallTextureColor, // Color map
            bumpMap: wallTextureRelieve, // Bump map
            bumpScale: 0.2, // Ajusta el valor según sea necesario
            normalMap: wallTextureNormal, // Normal map
            metalnessMap: wallTextureMetalidad, // Metalness map
            roughnessMap: wallTextureRugosidad, // Roughness map
            aoMap: wallTextureSombras, // Ambient Occlusion map
            displacementMap: wallTextureDespla16, // Displacement map
            displacementScale: 0, // Ajusta el valor según sea necesario
          });
        }
      });
      mundoDOS.position.set(0.5, -20 - 500, -20);
      mundoDOS.scale.set(10, 10, 10);
      mundoDOS.rotation.set(0, Math.PI * 0.5, 0);
      this.scene.add(mundoDOS);
      this.physics.add.existing(mundoDOS, {
        shape: 'concaveMesh',
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
          child.material = new THREE.MeshStandardMaterial({
            map: wallTextureColor, // Color map
            bumpMap: wallTextureRelieve, // Bump map
            bumpScale: 0.2, // Ajusta el valor según sea necesario
            normalMap: wallTextureNormal, // Normal map
            metalnessMap: wallTextureMetalidad, // Metalness map
            roughnessMap: wallTextureRugosidad, // Roughness map
            aoMap: wallTextureSombras, // Ambient Occlusion map
            displacementMap: wallTextureDespla16, // Displacement map
            displacementScale: 0, // Ajusta el valor según sea necesario
          });
        }
      });
      mundoTRES.position.set(0.5, -20 - 500, -20);
      mundoTRES.scale.set(10, 10, 10);
      mundoTRES.rotation.set(0, Math.PI * 0.5, 0);
      this.scene.add(mundoTRES);
      this.physics.add.existing(mundoTRES, {
        shape: 'concaveMesh',
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
    this.scene.background = new THREE.Color(0x00008b);

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
    this.scene.add(light);
    // FPS
    var stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    //url
    const urlParams = new URLSearchParams(window.location.search);
    const debug = urlParams.get('debug');
    const fps = urlParams.get('fps');

    // physics
    this.physics = new AmmoPhysics(this.scene);
    // Habilitar el modo debug si el parámetro 'debug' es igual a 'true'
    if (debug === 'true') {
      this.physics.debug?.enable();
    }
    if (fps === 'true') {
      document.body.appendChild(stats.dom);
    }

    /////////////////TEXTURE//////////////
    //rock
    const textureLoader = new THREE.TextureLoader();
    const tilesBaseDIFF = textureLoader.load(tilesBaseDIFFI);
    const tilesBaseDISP = textureLoader.load(tilesBaseDISPI);
    const tilesBaseNRM = textureLoader.load(tilesBaseNRMI);
    const tilesBaseOCC = textureLoader.load(tilesBaseOCCI);
    const tilesBaseSPEC = textureLoader.load(tilesBaseSPECI);
    //gold
    const goldTexture = textureLoader.load(tilesBaseGOLD);

    ////////////////

    // extract the object factory from physics
    // the factory will make/add object without physics
    const { factory } = this.physics;
    // blue box
    this.player = this.physics.add.box({ x: 0.05, y: 1, z: 98, width: 1, height: 1 }, { lambert: { color: 0x2194ce } });
    //camera target position
    orbitControls.target = this.player.position;
    //console.log(this.player);
    ////////
    this.player.material = new THREE.MeshStandardMaterial({
      map: tilesBaseDIFF, // Mapa de color/difusión
      normalMap: tilesBaseNRM, // Mapa de normales
      aoMap: tilesBaseOCC, // Mapa de oclusión ambiental
      displacementMap: tilesBaseDISP, // Mapa de desplazamiento
      displacementScale: 0, // Controla cuánto afecta el desplazamiento
      roughnessMap: tilesBaseSPEC, // Mapa de especularidad/aspereza
    });

    ////////////////////
    // pariculas
    /*this.particleGeometry = new THREE.BufferGeometry();
    
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

      setTimeout(() => {
        // Limpia las posiciones de las partículas
        for (let i = 0; i < positions.length; i += 3) {
          positions[i] = 0;
          positions[i + 1] = 0;
          positions[i + 2] = 0;
        }
        // Actualiza los atributos de la geometría y notifica a Three.js que se han actualizado
        this.particleGeometry.attributes.position.needsUpdate = true;
      }, 500);

     const positions = this.particleGeometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] = (Math.random() - 0.5) * 5 ;
        positions[i + 1] = Math.random() * 5 ;
        positions[i + 2] = (Math.random() - 0.5) * 5 ;
      }
      this.particleGeometry.attributes.position.needsUpdate = true;
    }; */
    // Crea un sistema de renderizado para partículas
    const batchSystem = new BatchedRenderer();

    // Carga la textura para las partículas
    const texture = new THREE.TextureLoader().load(jumpParticle);

    // Configura el sistema de partículas para simular un salto
    const jumpParticlesConfig = {
      duration: 1.0, // Duración del efecto en segundos
      looping: false, // No es un efecto repetitivo
      startSpeed: new IntervalValue(8, 10), // Velocidad inicial
      startSize: new IntervalValue(0.5, 1), // Tamaño de las partículas
      startColor: new ConstantColor(new THREE.Vector4(1, 1, 1, 1)), // Color de inicio
      worldSpace: true, // Espacio global
      maxParticle: 100, // Máximo de partículas
      emissionOverTime: new ConstantValue(0), // Emisión con el tiempo
      emissionBursts: [
        {
          time: 0, // Inicia inmediatamente
          count: new ConstantValue(20), // Número de partículas
          cycle: 1, // Ciclos de emisión
          interval: 0.1, // Intervalo entre ciclos
          probability: 1, // Probabilidad de emisión
        },
      ],
      shape: new PointEmitter(), // Emisor puntual
      material: new THREE.MeshBasicMaterial({
        map: texture,

        transparent: true,
      }),
      renderOrder: 1, // Orden de renderizado
      renderMode: RenderMode.Mesh, // Modo de renderizado
    };

    // Crear sistema de partículas a partir de la configuración
    const jumpParticles = new ParticleSystem(jumpParticlesConfig);

    // Añadir comportamientos para modificar la trayectoria y apariencia de las partículas
    jumpParticles.addBehavior(
      new SizeOverLife(
        new PiecewiseBezier([
          [new Bezier(1, 0.5, 0.2, 0), 0], // Tamaño decrece con la vida
        ])
      )
    );

    jumpParticles.addBehavior(
      new FrameOverLife(
        new PiecewiseBezier([
          [new Bezier(0, 1, 2, 3), 0], // Animación del atlas
        ])
      )
    );

    // Añadir el sistema de partículas al BatchRenderer y al objeto en la escena
    batchSystem.addSystem(jumpParticles);
    this.scene.add(jumpParticles.emitter);
    this.scene.add(batchSystem);

    // Ajustar la posición del emisor para simular el origen del salto
    //jumpParticles.emitter.position.set(0, 0, 0); // Posición del emisor (cambiar según la escena)
    jumpParticles.emitter.position.set(this.player.position.x, this.player.position.y, this.player.position.z); // Posición particulas
    jumpParticles.emitter.rotation.set(0, Math.PI * 0.5, 0); // Rotación particulas para que miren a la cámara

    ////////////////////////////////
    //añadir cubeMap
    const rgbeLoader = new RGBELoader();

    rgbeLoader.load(skyCubeMap, (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      texture.minFilter = THREE.LinearFilter; // Filtro para suavizar cuando se escala hacia abajo
      texture.magFilter = THREE.LinearFilter; // Filtro para suavizar cuando se escala hacia arriba
      texture.generateMipmaps = true; // Genera mipmaps para un mejor rendimiento
      this.scene.background = texture;
      this.scene.environment = texture;
    });
    ////////////////////////////////
    //texture level
    const wallTextureSombras = textureLoader.load(tilesWallSombras);
    const wallTextureRelieve = textureLoader.load(tilesWallRelieve);
    const wallTextureColor = textureLoader.load(tilesWallColor);
    const wallTextureDesplazamiento = textureLoader.load(tilesWallDesplazamiento);
    const wallTextureDespla16 = textureLoader.load(tilesWallDesplazamiento16);
    const wallTextureMetalidad = textureLoader.load(tilesWallMetalidad);
    const wallTextureNormal = textureLoader.load(tilesWallNormal);
    const wallTextureRugosidad = textureLoader.load(tilesWallRugosidad);
    //lava texture
    const LavaTexturaApply = textureLoader.load(LavaTextura);
    //laser
    const LaserTexturaApply = textureLoader.load(LaserTextura);

    ///////////////////////////////
    //"../../assets/jump.mp3"

    // Crea un objeto AudioListener
    var listener = new THREE.AudioListener();
    this.player.add(listener);
    // Crea un nuevo objeto de audio
    var audioLoader = new THREE.AudioLoader();
    var self = this; // Guarda una referencia al contexto actual

    //loose
    audioLoader.load(looseSound, function (buffer) {
      self.audioLoose = new THREE.Audio(listener); // Crea el objeto audio aquí
      self.audioLoose.setBuffer(buffer);
      self.audioLoose.setLoop(false);
      self.audioLoose.setVolume(0.5);
    });
    //win
    audioLoader.load(winSound, function (buffer) {
      self.audioWin = new THREE.Audio(listener); // Crea el objeto audio aquí
      self.audioWin.setBuffer(buffer);
      self.audioWin.setLoop(false);
      self.audioWin.setVolume(0.5);
    });
    //jump

    audioLoader.load(jumpSound, function (buffer) {
      self.audio = new THREE.Audio(listener); // Crea el objeto audio aquí
      self.audio.setBuffer(buffer);
      self.audio.setLoop(true);
      self.audio.setVolume(0.5);
    });

    //coin
    audioLoader.load(coinSound, function (buffer) {
      self.audioCoin = new THREE.Audio(listener); // Crea el objeto audio aquí
      self.audioCoin.setBuffer(buffer);
      self.audioCoin.setLoop(true);
      self.audioCoin.setVolume(0.5);
    });

    ///////////////////////////////
    // static ground

    var grounBlock = this.physics.add.ground({ width: 1, height: 220 });
    //textura ground
    grounBlock.material = new THREE.MeshStandardMaterial({
      map: goldTexture, // Mapa de color
      metalness: 0.7,
      roughness: 0.3,
    });

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
    backLimmits.material = new THREE.MeshStandardMaterial({
      map: LaserTexturaApply, // Mapa de color
    });

    //
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
    LavaTexturaApply.repeat.x = 0.2;
    //LavaTexturaApply.repeat.y = 1;
    //texture.wrapS = THREE.RepeatWrapping;
    //texture.wrapT = THREE.RepeatWrapping;
    //texture.wrapY = THREE.RepeatWrapping;
    bottomLimmits.material = new THREE.MeshStandardMaterial({
      map: LavaTexturaApply, // Mapa de color
    });

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
    const text = new TextTexture('Score : ' + contadorMonedas, {
      fontWeight: 'bold',
      fontSize: 48,
    });
    const sprite = new TextSprite(text);
    const scale = 0.5;

    sprite.setScale(scale);
    sprite.setPosition(0 + (text.width * scale) / 2 + 12, height - (text.height * scale) / 2 - 12);
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
    window.addEventListener('keydown', (event) => {
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
        case 'KeyR':
          keys.r.pressed = true;

          finDeJuego = false;
          window.location.reload(); // Recargar la página

          break;
        case 'Space':
          // Realiza el salto.
          if (tocandoSuelo) {
            this.player.body.setVelocityY(5.5);
            //this.createParticles();
            // Ajustar la posición del emisor para simular el origen del salto

            jumpParticles.emitter.position.set(this.player.position.x, this.player.position.y, this.player.position.z); // Posición particulas

            // Disparar el sistema de partículas
            setTimeout(function () {
              jumpParticles.restart();
            }, 10);

            //

            self.audio.setLoop(false);
            if (!self.audio.isPlaying) {
              self.audio.play();
            }
            tocandoSuelo = false;
            setTimeout(function () {
              self.audio.stop();
            }, 300);
          }

          break;
      }
    });

    //control de coliciones :
    //

    //limites
    this.player.body.on.collision((collidedObject, event) => {
      if (collidedObject === bottomLimmits) {
        // Mostrar mensaje en el centro de la cámara
        const gameOverText = new TextTexture('Fin del juego. Presiona R para reiniciar', {
          fontWeight: 'bold',
          fontSize: 48,
        });
        const gameOverSprite = new TextSprite(gameOverText);
        gameOverSprite.setPosition(width / 2, height / 2);
        scene2d.add(gameOverSprite);

        // Detener la animación
        finDeJuego = true;
        return;
      } else if (collidedObject === backLimmits) {
        // Mostrar mensaje en el centro de la cámara
        const gameOverText = new TextTexture('Fin del juego. Presiona R para reiniciar', {
          fontWeight: 'bold',
          fontSize: 48,
        });
        const gameOverSprite = new TextSprite(gameOverText);
        gameOverSprite.setPosition(width / 2, height / 2);
        scene2d.add(gameOverSprite);
        finDeJuego = true;
      } else if (collidedObject === this.finnishLimit2) {
        // Mostrar mensaje en el centro de la cámara
        const gameOverText = new TextTexture('Fin del juego HAS GANADO. Presiona R para reiniciar', {
          fontWeight: 'bold',
          fontSize: 48,
        });
        const gameOverSprite = new TextSprite(gameOverText);
        gameOverSprite.setPosition(width / 2, height / 2);
        scene2d.add(gameOverSprite);
        self.winSound.play();
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
        this.scene.remove(this.finnishLimit1);
        //this.physics.destroy(mundoDOS);

        // Liberar memoria eliminando todas las referencias al mundoDos
        mundoDOS = null;
        this.finnishLimit1 = null;

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
          //
          self.audioCoin.setLoop(false);
          self.audioCoin.play();

          setTimeout(function () {
            self.audioCoin.stop();
          }, 300);
          //
          console.log('Colisión con moneda detectada');
          // Eliminar la moneda de la escena y del array
          monedas[i].position.y = -10;
          monedas[i].body.needUpdate = true;
          monedas.splice(i, 1);

          // Incrementar el contador de monedas recolectadas u realizar otras acciones
          contadorMonedas += 10;
          sprite.setText('Score : ' + contadorMonedas);
          console.log('contadorMonedas:', contadorMonedas);
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

    /////////////////////////////////////

    /////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////////////
    // Establecer un temporizador que ejecute la función cada 0.5 segundos
    setInterval(this.resetTocandoSuelo, 50); // 500 milisegundos = 0.5 segundos
    // loop
    const animate = () => {
      const clockDelta = clock.getDelta();
      ////////////FPS//////////////
      stats.begin();

      // particulas
      batchSystem.update(clockDelta); // Actualizar el BatchRenderer

      ////////////////////////////

      const animationID = requestAnimationFrame(animate);
      //controlar limites
      if (finDeJuego) {
        window.cancelAnimationFrame(animationID);
        self.audioLoose.play();
      }
      this.physics.update(clockDelta * 1000);
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
      finnishLimit.body.setVelocityZ(4.5); // Avanzar
      finnishLimit.body.setVelocityY(0.3); // No permitir que caiga por la gravedad
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

          this.finnishLimit1.body.setVelocityZ(4.5); // Avanzar
          this.finnishLimit1.body.setVelocityY(0.4); // No permitir que caiga por la gravedad
          // Asegúrate de ajustar la lógica según sea necesario para mundoDOS
        }
      } else if (nivel === 2) {
        if (mundoTRES) {
          mundoTRES.position.z += velocidadMUNDO;
          mundoTRES.body.needUpdate = true;
          monedas.forEach((coin) => {
            coin.body.needUpdate = true;
          });

          this.finnishLimit2.body.setVelocityZ(4.5); // Avanzar
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

      stats.end();
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
        shape: 'concaveMesh',
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
