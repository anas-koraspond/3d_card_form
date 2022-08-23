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
import {
    MeshBasicMaterial
} from 'three';
import './Card.css'
// import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'
import {
    FontLoader
} from "three/examples/jsm/loaders/FontLoader";



const scene = new THREE.Scene();
let camera = {};
let renderer = null;
let font = null;
window.scene = scene;

export default function Card({card}) {
    const mount = useRef()

    // instantiate a loader
    const objectLoader = new OBJLoader();
    const textureLoader = new THREE.TextureLoader();
    const fontLoader = new FontLoader();

    let frameId;

    const animateCard = () => {
        const card = scene.getObjectByName('Card-group');
        if (card) card.rotation.y -= 0.03
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

    // const stop = () => {
    //     cancelAnimationFrame(frameId)
    //     frameId = null
    // }


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

    function creditCardType(cc) {

        if (cc.length < 12) {
            return undefined;
        }
        let amex = new RegExp('^3[47][0-9]{13}$');
        let visa = new RegExp('^4[0-9]{12}(?:[0-9]{3})?$');
        let cup1 = new RegExp('^62[0-9]{14}[0-9]*$');
        let cup2 = new RegExp('^81[0-9]{14}[0-9]*$');
      
        let mastercard = new RegExp('^5[1-5][0-9]{14}$');
        let mastercard2 = new RegExp('^2[2-7][0-9]{14}$');
      
        let disco1 = new RegExp('^6011[0-9]{12}[0-9]*$');
        let disco2 = new RegExp('^62[24568][0-9]{13}[0-9]*$');
        let disco3 = new RegExp('^6[45][0-9]{14}[0-9]*$');
        
        let diners = new RegExp('^3[0689][0-9]{12}[0-9]*$');
        let jcb =  new RegExp('^35[0-9]{14}[0-9]*$');
      
      
        if (visa.test(cc)) {
          return 'VISA';
        }
        if (amex.test(cc)) {
          return 'AMEX';
        }
        if (mastercard.test(cc) || mastercard2.test(cc)) {
          return 'MASTERCARD';
        }
        if (disco1.test(cc) || disco2.test(cc) || disco3.test(cc)) {
          return 'DISCOVER';
        }
        if (diners.test(cc)) {
          return 'DINERS';
        }
        if (jcb.test(cc)) {
          return 'JCB';
        }
        if (cup1.test(cc) || cup2.test(cc)) {
          return 'CHINA_UNION_PAY';
        }
        return undefined;
      }


    useEffect(() => {

        console.log('init')

        let width = 500 //mount.current.clientWidth / 2
        let height = 500
    
        Promise.all([loadObjectPromise(), loadTextureProcise(), loadFontPromise()]).then(data => {
            // console.log(data)
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
            groupText.add(makeText('Revoult', {x: 1.7, y: 3.5, z}, 1, 1, 'bank-name'));
    
            groupText.add(makeText(card.card_number, {x:-1, y: 3.5, z}, 1, 1,'card-number'));
            groupText.add(makeText(`${card.first_name} ${card.last_name}`, {x: -2.25, y: 3.5, z}, 1, 0.8,'card-name'));
            
            groupText.add(makeText('VALID THRU', {x: -1.5, y: -0.8, z}, 1,0.3, 'valid-text'));
            groupText.add(makeText(card.card_exp , {x: -1.75, y:-0.8, z}, 1,  0.3,'card-exp'));
    
            groupText.add(makeText(card.card_secure , {x: 0.1, y: 2.6, z: -0.01}, 0, 1,'card-secure'));
            group.add(groupText);
    
            scene.add(group) 
    
            camera = new THREE.PerspectiveCamera(1, width / height, 500);
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
            renderer.setSize(width, height)
            
            start()
    
        })

    }, [])

    useEffect(() => {
        console.log('CARD', card)
        if (card) {
        const group = scene.getObjectByName('Group-text');
        if (group) {
            group.children = [];
            const z = 0.1;
            
            group.add(makeText('Revoult', {x: 1.7, y: 3.5, z}, 1, 1, 'bank-name'));
    
            group.add(makeText(card.card_number, {x:-1, y: 3.5, z}, 1, 1,'card-number'));
            group.add(makeText(`${card.first_name} ${card.last_name}`, {x: -2.25, y: 3.5, z}, 1, 0.8,'card-name'));
            
            group.add(makeText('VALID THRU', {x: -1.5, y: -0.8, z}, 1,0.3, 'valid-text'));
            group.add(makeText(card.card_exp , {x: -1.75, y:-0.8, z}, 1,  0.3,'card-exp'));

            group.add(makeText(card.card_secure , {x: 0.1, y: 2.6, z: -0.01}, 0, 1,'card-secure'));
        }

        }
    }, [card])

    return ( <canvas className="Card" ref={mount}/>)
}