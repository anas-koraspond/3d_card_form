import * as THREE from 'three';
import {
    OrbitControls
} from "three/examples/jsm/controls/OrbitControls";
import {
    OBJLoader
} from 'three/examples/jsm/loaders/OBJLoader.js';
import {
    useRef,
    useEffect
} from 'react'
import './Card.css'
import {
    FontLoader
} from "three/examples/jsm/loaders/FontLoader";
import moment from 'moment';
import useDeviceDetect from '../utils/useDeviceDetect';

const scene = new THREE.Scene();
let camera = {};
let renderer, font, blockDirection = null;
let animationSpeed = Math.PI/7 / 100
let animationPreviewRotate = Math.PI/7 / 10
let preview, memoCollapsed = false;
let frameId;
let isMobile = false;

let windowDetails = {
    width:  window.innerWidth > 750 ? 750 : window.innerWidth,
    height: window.innerWidth > 750 ? 350 : window.innerWidth/2,
}


const stop = () => {
    cancelAnimationFrame(frameId)
    frameId = null
}


let onWindowResize = function () {
    windowDetails.width = isMobile && memoCollapsed ? 50 : window.innerWidth > 750 ? 750 : window.innerWidth;
    windowDetails.height = isMobile && memoCollapsed ? 100 : windowDetails.width /2
    camera.aspect = windowDetails.width / windowDetails.height;
    camera.updateProjectionMatrix();
    renderer.setSize( windowDetails.width,  windowDetails.height );
  }
window.addEventListener("resize", onWindowResize, false);


export const setPreviewBoolean = (boolean) => {
    preview = boolean;
}
const previewCardAnimation = () => {

    if (!preview) {
        return;
    }

    const card = scene.getObjectByName('Card-group');
    const stop = 35 * 3.6;
    const angle = animationPreviewRotate;
    if (card.rotation.y < stop) {
        if (blockDirection) {
            card.rotation.y +=  angle;

        }

        if (!blockDirection) {
            card.rotation.y -=  angle;
        }

    }
}

export default function Card({card, collapse}) {
    console.log("🚀 ~ file: Card.js ~ line 74 ~ Card ~ isMobile", isMobile)
    const mount = useRef();

    isMobile = useDeviceDetect().isMobile;
    // instantiate a loader
    const objectLoader = new OBJLoader();
    const textureLoader = new THREE.TextureLoader();
    const fontLoader = new FontLoader();

    const animateCard = () => {
        // console.log('animate card', preview)
        if (preview) {
            return;
        }
        const card = scene.getObjectByName('Card-group');
        const stop = 0.3//3.6;
        const start = 0;
        const angle = animationSpeed
        if (blockDirection && card.rotation.y < stop) {
            card.rotation.y +=  angle;

        }else  {
            card.rotation.y -= angle;

            blockDirection = false;

            if (card.rotation.y <= start) {
                blockDirection = true;
            }
        }
    }

    const renderScene = () => {
        renderer.render(scene, camera)
    }

    const animate = () => {

        renderScene()
        frameId = window.requestAnimationFrame(animate);
        animateCard();
        previewCardAnimation();
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
            'models/Credit_Card.obj',
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
            'test/TextureTest.jpg',

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
        memoCollapsed = collapse;

        windowDetails.width = isMobile && collapse ? 50 : window.innerWidth > 750 ? 750 : window.innerWidth;
        console.log("🚀 ~ file: Card.js ~ line 242 ~ useEffect ~ windowDetails", windowDetails)
        windowDetails.height = isMobile && collapse ? 100 : isMobile ? windowDetails.width/1.2 : windowDetails.width /2;




        console.log("🚀 ~ file: Card.js ~ line 244 ~ useEffect ~ windowDetails", windowDetails)
    
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
            group.rotateZ(Math.PI/3)
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
            const z = 0.1;

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

    }, [])

    useEffect(() => {



        console.log('CARD', card)
        if (card) {
        const group = scene.getObjectByName('Group-text');
        if (group) {
            group.children = [];
            updateTextObjects(group, card);
            windowDetails.width = isMobile && collapse ? 50 : window.innerWidth > 750 ? 750 : window.innerWidth;
            console.log("🚀 ~ file: Card.js ~ line 242 ~ useEffect ~ windowDetails", windowDetails)
            windowDetails.height = isMobile && collapse ? 100 : isMobile ? windowDetails.width/1.5 : windowDetails.width /2;
            renderer && renderer.setSize(windowDetails.width, windowDetails.height);
        }

        }
    }, [card])

    useEffect(() => {
        memoCollapsed = collapse;
        windowDetails.width = isMobile && collapse ? 50 : window.innerWidth > 750 ? 750 : window.innerWidth;
        console.log("🚀 ~ file: Card.js ~ line 242 ~ useEffect ~ windowDetails", windowDetails)
        windowDetails.height = isMobile && collapse ? 100 : isMobile ? windowDetails.width/1.5 : windowDetails.width /2;
        renderer && renderer.setSize(windowDetails.width, windowDetails.height);

    }, [collapse])

    return ( <canvas className={isMobile && collapse ? "Card Card__Collapse" : "Card"}ref={mount}/>)
} 