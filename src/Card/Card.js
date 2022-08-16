import * as THREE from 'three';
import {
    OrbitControls
} from "three/examples/jsm/controls/OrbitControls";
import {
    OBJLoader
} from 'three/examples/jsm/loaders/OBJLoader.js';
import {
    useRef,
    useEffect,
    useState
} from 'react'
import {
    MeshBasicMaterial
} from 'three';
import PSD from 'psd.js/dist/psd.min'
import './Card.css'
import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'
import {
    FontLoader
} from "three/examples/jsm/loaders/FontLoader";
import {
    TextGeometry
} from 'three/examples/jsm/geometries/TextGeometry';
import {
    Group
} from 'antd/lib/avatar';
import {
    storage
} from '../storage';
import { useContext } from 'react';
import Context from '../context';
let setted = false;
let count = 0;

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
        // animatePlanets()
        animateCard();
    }


    const start = () => {
        if (!frameId) {
            frameId = requestAnimationFrame(animate)
        }
    }

    const stop = () => {
        cancelAnimationFrame(frameId)
        frameId = null
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
            'test/metallic.png',

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

    // const generateText = (text, name, pos, size, font) => {
    //     // const group = new THREE.Group();
        
    //     // let geometry = new TextGeometry(text, {
    //     //     font: font,
    //     //     size: 100,
    //     //     height: 1,
    //     //     curveSegments: 12,
    //     //     bevelEnabled: true,
    //     //     bevelThickness: 0.5,
    //     //     bevelSize: 8,
    //     //     bevelOffset: 1,
    //     //     bevelSegments: 12
    //     // });
    //     // const material = new THREE.MeshBasicMaterial({
    //     //     color: 0xffffff
    //     // });
    //     // let textMesh = new THREE.Mesh(geometry, material);
    //     // textMesh.name = name;

    //     // textMesh.material = material;
    //     // textMesh.scale.set(0.0045, 0.0045, 0.0045)
    //     // textMesh.rotateZ(-Math.PI / 3);
    //     // textMesh.position.set(-2.5, 2.5, 0);

    //     // // group.add(textMesh);
    //     // return textMesh
    //     // return group;

    //     const color = 0x006699;

    //     const matDark = new THREE.LineBasicMaterial( {
    //         color: color,
    //         side: THREE.DoubleSide
    //     } );

    //     const matLite = new THREE.MeshBasicMaterial( {
    //         color: color,
    //         transparent: true,
    //         opacity: 0.4,
    //         side: THREE.DoubleSide
    //     } );

    //     const message = '   Three.js\nSimple text.';

    //     const shapes = font.generateShapes( message, 1 );

    //     const geometry = new THREE.ShapeGeometry( shapes );

    //     geometry.computeBoundingBox();

    //     const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );

    //     geometry.translate( xMid, 0, 0 );

    //     // make shape ( N.B. edge view not visible )

    //     const text = new THREE.Mesh( geometry, matLite );
    //     text.name = "Card-number"
    //     text.position.z = - 150;
    //                 text.rotateZ(-Math.PI / 3);
    //     text.position.set(-2.5, 2.5, 0);

    //     return text
    // }

    const makeText = (message, pos, side, fontSize, name) => {
        const color = 0xffffff;

        // const matDark = new THREE.LineBasicMaterial( {
        //     color: color,
        //     // side: THREE.DoubleSide
        // } );

        const matLite = new THREE.MeshBasicMaterial( {
            color: color,
            // transparent: true,
            opacity: 1,
            // side: THREE.DoubleSide
        } );

        const shapes = font.generateShapes( message, 0.5 * fontSize );

        const geometry = new THREE.ShapeGeometry( shapes );

        geometry.computeBoundingBox();

        const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );

        geometry.translate( 0, 0, 0 );

        // make shape ( N.B. edge view not visible )

        const text = new THREE.Mesh( geometry, matLite );
        text.name = name || 'test';
        text.position.z = - 150;
        text.rotateZ(-Math.PI / 2);
        text.position.set(pos.x, pos.y, pos.z);
        return text;

    }
    useEffect(() => {


        //TODO MERGE 2 usse effects


        // console.log(scene)
        //todo wyrzucic i zrobic po ludzku
        // const oldCard = scene.getObjectByName('Card-group');
        // if(oldCard) oldCard.children = [];

        let width = 500 //mount.current.clientWidth / 2
        let height = 500

        Promise.all([loadObjectPromise(), loadTextureProcise(), loadFontPromise()]).then(data => {
            // console.log(data)
            const object = data[0];
            const texture = data[1];
            font = data[2];

            let material = new THREE.MeshBasicMaterial({
                map: texture
            })

            //make group 
            const group = new THREE.Group();
            group.rotateZ(Math.PI/3)
            group.name = 'Card-group';

            //painting
            object.name = 'Card'
            object.material = material;
            object.children.map(child => {
                // child.material = material;
                // if (child.name === 'Mball') {
                //     child.material = new THREE.MeshBasicMaterial({
                //         color: 0xe40000
                //     })
                // }
                return child;
            });

            group.add(object);

        const groupText = new THREE.Group();
        groupText.name = 'Group-text'


            // const color = 0xffffff;

            // const matDark = new THREE.LineBasicMaterial( {
            //     color: color,
            //     side: THREE.DoubleSide
            // } );

            // const matLite = new THREE.MeshBasicMaterial( {
            //     color: color,
            //     transparent: true,
            //     opacity: 1,
            //     side: THREE.DoubleSide
            // } );

            // const message = card.card_number;

            // const shapes = font.generateShapes( message, 0.5 );

            // const geometry = new THREE.ShapeGeometry( shapes );

            // geometry.computeBoundingBox();

            // const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );

            // geometry.translate( 0, 0, 0 );

            // // make shape ( N.B. edge view not visible )

            // const text = new THREE.Mesh( geometry, matLite );
            // text.name ='test';
            // text.position.z = - 150;
            //             text.rotateZ(-Math.PI / 3);
            // text.position.set(-2.85, 2.5, 0);
            // groupText.add( text );

            //texts 

            // let cardNameGeometry = new TextGeometry(card ? card.card_number : 'card number', {
            //     font: font,
            //     size: 100,
            //     height: 1,
            //     curveSegments: 12,
            //     bevelEnabled: true,
            //     bevelThickness: 0.5,
            //     bevelSize: 8,
            //     bevelOffset: 1,
            //     bevelSegments: 12
            // });
            // material = new THREE.MeshBasicMaterial({
            //     color: 0xffffff
            // });
            // let textMesh = new THREE.Mesh(cardNameGeometry, material);
            // textMesh.name = 'Card-number';

            // textMesh.material = material;
            // textMesh.scale.set(0.0045, 0.0045, 0.0045)
            // textMesh.rotateZ(-Math.PI / 3);
            // textMesh.position.set(-2.5, 2.5, 0);

            // group.add(textMesh);


            // let firstLastNameGeometry = new TextGeometry(card ? (card.first_name + ' ' + card.last_name) : 'first and last name', {
            //     font: font,
            //     size: 100,
            //     height: 1,
            //     curveSegments: 12,
            //     bevelEnabled: true,
            //     bevelThickness: 0.5,
            //     bevelSize: 8,
            //     bevelOffset: 1,
            //     bevelSegments: 12
            // });
            // material = new THREE.MeshBasicMaterial({
            //     color: 0xffffff
            // });
            // textMesh = new THREE.Mesh(firstLastNameGeometry, material)
            // textMesh.name = 'Card-owner';


            // textMesh.material = material;
            // textMesh.scale.set(0.0045, 0.0045, 0.0045)
            // textMesh.rotateZ(-Math.PI / 3);
            // textMesh.position.set(-3.5, 2, 0);
            // -2.25, 3.5, 0
            groupText.add(makeText('BANK', {x: 1.7, y: 3.5, z:0}, 1, 1, 'test'));

            groupText.add(makeText(card.card_number, {x:-1, y: 3.5, z:0}, 1, 1,'test'));
            groupText.add(makeText(card.first_name + '' +   card.last_name, {x: -2.25, y: 3.5, z:0}, 1, 0.8,'test'));
            
            groupText.add(makeText('VALID THRU', {x: -1.5, y: -1, z:0}, 1,0.5, 'test'));
            groupText.add(makeText(card.card_exp , {x: -1.8, y:-1.2, z:0}, 1,  0.4,'test'));

            groupText.add(makeText(card.card_secure , {x: -1, y: 0, z:-0.2}, 0, 0.6,'test'));
            group.add(groupText)
                
            count++;

            //very bad thing //! TO REMOVE 
        //    if(!setted && count === 2)
        //     {
        //     setted = true
            scene.add(group) 
            // } 

            // //todo
            //add images add texts

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
            
            const handleResize = () => {
                width = mount.current.clientWidth
                height = mount.current.clientHeight
                renderer.setSize(width, height)
                camera.aspect = width / height
                camera.updateProjectionMatrix()
                renderScene()
            }
    
            start()

        })

    }, [])

    useEffect(() => {
        console.log('Update details')
        // stop();

        // const group = scene.getObjectByName('Card-group');
        const number = scene.getObjectByName('Card-number');
        // console.log("🚀 ~ file: Card.js ~ line 329 ~ useEffect ~ number", number)
        const test = scene.getObjectByName('test');
        const name = scene.getObjectByName('Card-owner');
        const group = scene.getObjectByName('Group-text');
        const oldCard = scene.getObjectByName('Card-group');

        // oldCard.children = [];

        
        // console.log(card);
        // console.log(test);
        
        if (test) {
            // console.log("🚀 ~ file: Card.js ~ line 342 ~ useEffect ~ number", number)
            group.children = [];
            // scene.remove(test);
            // console.log("🚀 ~ file: Card.js ~ line 344 ~ useEffect ~ number", number)
            // scene.getObjectByName('Card-group').add(generateText(card.card_number, 'Card-number', null, null, font));

            // group.add(makeText(card.card_number, {x:-1.5, y: 3.5, z:0}, 1, 'test') );
            // group.add(makeText(card.first_name + ' ' + card.last_name, {x: -2.25, y: 3.5, z:0}, 1, 'test'));
            group.add(makeText('BANK', {x: 1.7, y: 3.5, z:0}, 1, 1, 'test'));

            group.add(makeText(card.card_number, {x:-1, y: 3.5, z:0}, 1, 1,'test'));
            group.add(makeText(card.first_name + '' +   card.last_name, {x: -2.25, y: 3.5, z:0}, 1, 0.8,'test'));
            
            group.add(makeText('VALID THRU', {x: -1.5, y: -1, z:0}, 1,0.5, 'test'));
            group.add(makeText(card.card_exp , {x: -1.8, y:-1.2, z:0}, 1,  0.4,'test'));

            group.add(makeText(card.card_secure , {x: -1, y: 0, z:-0.2}, 0, 0.6,'test'));

        }
    }, [card])

    return ( <canvas className="Card" ref={mount}/>)
}