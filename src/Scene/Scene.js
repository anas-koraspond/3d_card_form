import * as THREE from 'three';
import {
    OrbitControls
} from "three/examples/jsm/controls/OrbitControls";
import {
    OBJLoader
} from 'three/examples/jsm/loaders/OBJLoader.js';
import {
    useRef,
    useState,
    useEffect
} from 'react'
import './Scene.css'
import {
    FontLoader
} from "three/examples/jsm/loaders/FontLoader";
import moment, { isMoment } from 'moment';
import useDeviceDetect from '../utils/useDeviceDetect';

const scene = new THREE.Scene();
let camera = null;
let renderer, font, blockDirection = null;
let animationSpeed = 0
let animationPreviewRotate = Math.PI/7 / 10
let frameId;

let windowDetails = {
    width:  window.innerWidth > 390 ? window.innerWidth/2 : window.innerWidth,
    height: window.innerWidth,// > 750 ? 350 : window.innerWidth/2,
}


const stop = () => {
    cancelAnimationFrame(frameId)
    frameId = null
}


let onWindowResize = function () {
    windowDetails.width = window.innerWidth > 390 ? window.innerWidth/2 : window.innerWidth
    windowDetails.height =  windowDetails.width
    if (camera) {
      camera.aspect = windowDetails.width / windowDetails.height;
      camera.updateProjectionMatrix();
    }
    renderer && renderer.setSize( windowDetails.width,  windowDetails.height );
  }




export default function Scene({card, confirmed}) {
    const mount = useRef();
    const [reset, setReset] = useState(false);
    // instantiate a loader
    const objectLoader = new OBJLoader();
    const textureLoader = new THREE.TextureLoader();
    const fontLoader = new FontLoader();


    const animateCard = () => {
    //     // console.log('animate card', preview)
        const card = scene.getObjectByName('Card-group');
        card.rotation.y +=  animationSpeed;
    }

    const renderScene = () => {
        renderer.render(scene, camera)
    }

    const animate = () => {

        renderScene()
        frameId = window.requestAnimationFrame(animate);
        animateCard();
    }


    const start = () => {
        if (!frameId) {
            frameId = requestAnimationFrame(animate)
        }
    }


    const updateTextObjects = (group, card,) => {
        const z = 0.1;
        group.add(makeText('Revoult', {x: 1.7, y: 3.5, z}, 1, 1, 'bank-name'));
    
        group.add(makeText(card.card_number, {x:-1, y: 3.5, z}, 1, 1,'card-number'));
        const nameFontSize = `${card.first_name} ${card.last_name}`.length >= 16 ? 0.4 : 0.8;
        group.add(makeText(`${card.first_name} ${card.last_name}`, {x: -2.25, y: 3.5, z}, 1,nameFontSize,'card-name'));
        
        group.add(makeText('VALID THRU', {x: -1.5, y: -0.8, z}, 1,0.3, 'valid-text'));
        group.add(makeText(moment(card.card_exp).format('DD/MM/YYYY') , {x: -1.75, y:-0.8, z}, 1,  0.3,'card-exp'));

        group.add(makeText(card.card_secure , {x: 0.1, y: 2.6, z: -0.01}, 0, 0.5,'card-secure'));
    }


    const loadObjectPromise = () => {
        return new Promise((resolve, reject) => {
                    // load a resource
        objectLoader.load(
            // resource URL
            'models/CreditCard.obj',
            // called when resource is loaded
            function (object) {
                resolve(object)
            },
            // called when loading is in progresses
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            // called when loading has errors
            function (error) {
                console.log('An error happened');
                reject();
            }
        );
        })
    }

    const loadTextureProcise = () => {
        return new Promise((resolve, reject) => {

                        // load a resource 
            textureLoader.load(
            // resource URL
            'textures/VisaTexture.jpg',

            // onLoad callback
            function (texture) {
            resolve(texture)
            },
            undefined,

            // onError callback
            function (err) {
                console.error('An error happened.');
                reject()
            }
            );
        })
    }

    const loadFontPromise = () => {
        return new Promise((resolve, reject) => {

            fontLoader.load(
                'fonts/helvetiker_regular.typeface.json',
                (font) => {
                    resolve(font)
                },

                // onProgress callback currently not supported
                undefined,

                // onError callback
                function (err) {
                    console.error('An error happened.');
                    reject();
                }
            );
        });
    }

    const makeText = (message, pos, side, fontSize, name) => {
        const color = 0xffffff;
        const matLite = new THREE.MeshBasicMaterial( {
            color: color,
            // transparent: true,
            opacity: 1,
            // side: THREE.DoubleSide
        } );

        const shapes = font.generateShapes( message, 0.5 * fontSize );

        const geometry = new THREE.ShapeGeometry( shapes );

        geometry.computeBoundingBox();

        geometry.translate( 0, 0, 0 );

        const text = new THREE.Mesh( geometry, matLite );
        text.name = name || 'test';
        text.position.z = - 150;
        !side && text.rotateX(-Math.PI)
        text.rotateZ(-Math.PI / 2);
        text.position.set(pos.x, pos.y, pos.z);
        return text;

    }

    useEffect(() => {
        onWindowResize();
        Promise.all([loadObjectPromise(), loadTextureProcise(), loadFontPromise()]).then(data => {
            // console.log(data) z
            const object = data[0];
            const texture = data[1];
            font = data[2];
    
            let material = new THREE.MeshBasicMaterial({
                map: texture,
                // color: 0xffffff,
                side: THREE.DoubleSide
            })
    
            //make group 
            const group = new THREE.Group();
            group.rotateZ(Math.PI/2)
            group.name = 'Card-group';
    
            //painting
            object.name = 'Card'
            object.material = material;
            object.children.map(child => {
                child.material = material;
                return child;
            });
    
            group.add(object);
    
            const groupText = new THREE.Group();
            groupText.name = 'Group-text'
            const z = 0.15;

            updateTextObjects(groupText, card, z);
      
            group.add(groupText);
    
            scene.add(group) 
    
            camera = new THREE.PerspectiveCamera(1, windowDetails.width / windowDetails.height, 450);
            camera.qulerOrder = 'YXZ';
            window.camera = camera;
            renderer = new THREE.WebGLRenderer({
                canvas: mount.current,
                alpha: true
            })
            renderer.setClearColor(0xffffff, 0); // second param is opacity, 0 => transparent
    
            const controls = new OrbitControls(camera, renderer.domElement);
            controls.listenToKeyEvents(window);
    
            controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
            controls.dampingFactor = 0.05;
    
            controls.screenSpacePanning = false;
            controls.enableZoom = false;
            camera.position.z = 600;
    
            const dirLight0 = new THREE.SpotLight(0xcccccc, 0.5);
            dirLight0.position.set(0, 0, 0);
            dirLight0.rotateZ(Math.PI / 2);
            scene.add(dirLight0);
    
            const dirLight1 = new THREE.SpotLight(0xccccc, 1);
            dirLight1.position.set(10, 0, 0);
            scene.add(dirLight1);
            renderer.setSize(windowDetails.width, windowDetails.height)
            
            start()
    
        })
        window.addEventListener("resize", onWindowResize(), false);
    }, [])

    useEffect(() => {
        if (card) {
          const group = scene.getObjectByName('Group-text');
          if (group) {
              group.children = [];
              updateTextObjects(group, card);
              onWindowResize()
          }
        }
    }, [card])

    useEffect(() => {
        if(confirmed)  animationSpeed = animationPreviewRotate;
        if (!confirmed) {
            animationSpeed = 0;
            setReset(!reset);
        }
    }, [confirmed])

    useEffect(() => {
        const card = scene.getObjectByName('Card-group');
        if (card ) {
            card.rotation.set(0, 0, 0);
            card.rotateZ(Math.PI/2)
        }
    }, [reset])

    return ( <canvas className={"Card"} ref={mount}/>)
} 