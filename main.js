let scene, camera, renderer, stars, starGeo;
let mars, marsGeom, rover, light, input;
let whl1, whl2, whl3, whl4, whl5, whl6;
let movefront=0;
let rotationSpeed = 0.05;
y_axis = new THREE.Vector3(0, 1, 0);
var clock = new THREE.Clock();


function scenes() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.00000025);
    var axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
}

function cam() {
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 60, 100);
    camera.lookAt(scene.position);
}

function lights() {

    //ambient light
    hlight = new THREE.AmbientLight(0xffffff, 4);
    scene.add(hlight);

    //directional light
    directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 1, 1);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
}


function rend() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function starAdd() {
    starGeo = new THREE.Geometry();

    for (let i = 0; i < 6000; i++) {
        star = new THREE.Vector3(
            Math.random() * 600 - 300,
            Math.random() * 600 - 300,
            Math.random() * 600 - 300
        );
        star.velocity = 0;
        star.acceleration = 0.02;
        starGeo.vertices.push(star);
    }

    let sprite = new THREE.TextureLoader().load('images/star.png');
    let starMaterial = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 0.7,
        map: sprite
    });

    stars = new THREE.Points(starGeo, starMaterial);
    scene.add(stars);
}

function orbCont() {
    let controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', renderer);
}

function loadModels() {

    let loader = new THREE.GLTFLoader();
    loader.load('models3d/spaceship/scene.gltf', function (gltf) {
        // console.log(gltf);
        rocket = gltf.scene.children[0];
        rocket.scale.set(0.005, 0.005, 0.005);
        rocket.position.set(0, 0, 0);
        // rocket.add(camera);
        goal = new THREE.Object3D;
        // goal.position.set(0,10, 0);
        rocket.add(goal);
        scene.add(gltf.scene);
    });
    loader.load('models3d/earth/scene.gltf', function (gltf) {
        console.log(gltf);
        earth = gltf.scene.children[0];
        earth.scale.set(0.2, 0.2, 0.2);
        earth.position.set(-100, 0, 200);
        // earth.rotation.z = Math.PI / 2;
        scene.add(gltf.scene);
    });

    loader.load('models3d/jupiter/scene.gltf', function (gltf) {
        // console.log(gltf);
        jupiter = gltf.scene.children[0];
        jupiter.scale.set(20, 20, 20);
        jupiter.position.set(200, 0, -100);
        // jupiter.rotation.y = Math.PI / 180;
        scene.add(gltf.scene);
    });
    loader.load('models3d/pluto/scene.gltf', function (gltf) {
        // console.log(gltf);
        pluto = gltf.scene.children[0];
        pluto.scale.set(10, 10, 10);
        pluto.position.set(-102, 0, -100);
        // pluto.rotation.z = Math.PI / 2;
        scene.add(gltf.scene);
    });

    loader.load('models3d/neptune/scene.gltf', function (gltf) {
        // console.log(gltf);
        neptune = gltf.scene.children[0];
        neptune.scale.set(10, 10, 10);
        neptune.position.set(200, 0, 200);
        // neptune.rotation.z = Math.PI / 2;
        scene.add(gltf.scene);
    });
}

function init() {
    rend();
    scenes();
    // loadModels();
    loadMars();
    addRover();
    cam();
    orbCont();
    lights();
    // starAdd();
    animate();
}

init();

window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function distance() {
    // cameraDist = camera.position.length();

    // dMoonVec.subVectors(camera.position, meshMoon.position);
    // dMoon = dMoonVec.length();

}


function animate() {
    renderer.clear();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}


function starGen() {
    starGeo.vertices.forEach(p => {
        p.velocity += p.acceleration
        p.z += p.velocity;

        if (p.z > 200) {
            p.z = -200;
            p.velocity = 0;
        }
    });
    starGeo.verticesNeedUpdate = true;
}


function moveCam() {
    if (rover) {
        camera.position.copy(rover.mesh.position).add(new THREE.Vector3(40, 25, 40));
        camera.lookAt(rover.mesh.position);

        light.target.position.copy(rover.mesh.position);
        light.position.addVectors(light.target.position, new THREE.Vector3(20, 20, -15));
    }
}


document.addEventListener('keydown', function (ev) {
    switch (ev.keyCode) {
        case 37: // left
            // input.direction = 1;
            break;
        case 38: // forward
            // input.power = true;
            // movefront = 1;
            break;
        case 39: // right
            // input.direction = -1;
            break;
        case 40: // back
            // input.power = false;
            break;
    }
});
document.addEventListener('keyup', function (ev) {
    switch (ev.keyCode) {
        case 37: // left
            // input.direction = null;
            // moveFront()
            break;
        case 38: // forward
            // input.power = null;
            break;
        case 39: // right
            // input.direction = null;
            break;
        case 40: // back
            // input.power = null;
            break;
    }
});

//loads the plain
function loadMars() {
    // marsGeom = new THREE.BoxGeometry(650, 17, 17);
    marsGeom = new THREE.PlaneGeometry(1000, 1000, 100, 100);
    buildTerrain();
    var marsTexture = new THREE.TextureLoader().load('textures/mars_texture.jpg');
    var marsMaterial =new THREE.MeshBasicMaterial({ map: marsTexture });
    mars = new THREE.Mesh(marsGeom, marsMaterial);
    mars.receiveShadow = true;
    // mars.position.y = -400;
    mars.rotation.x = -Math.PI / 2;
    scene.add(mars);
}

//creates noisy terrain
function buildTerrain() {
    for (var i = 0; i < marsGeom.vertices.length; i++) {
        var vertex = marsGeom.vertices[i];
        value = noise.simplex2(vertex.x / 100, vertex.y / 100);
        vertex.z = Math.abs(value) * 5;
    }
    marsGeom.computeFaceNormals();
    marsGeom.computeVertexNormals();
}

//returns a wheel
function addWheel(x, y, z) {
    var sphGeo = new THREE.CylinderBufferGeometry(2.5, 2.5, 2, 32);
    var sphmat = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('textures/metal.jpg') });
    var sph = new THREE.Mesh(sphGeo, sphmat);
    sph.castShadow = true;
    sph.position.y -= y;
    sph.position.z += z;
    sph.position.x += x;
    sph.add(innerWheel());
    sph.rotation.x = Math.PI / 2;
    return sph;
}

//inner wheel 
function innerWheel() {
    var sphGeo = new THREE.TorusGeometry(0.2, 1, 16, 100);
    var sphmat = new THREE.MeshLambertMaterial({ color: 0x000000 });
    var sph = new THREE.Mesh(sphGeo, sphmat);
    return sph;
}

//add rover to scene
function addRover() {
    var boxGeo = new THREE.BoxGeometry(30, 4, 18);
    var boxMat = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('textures/gold.jpg') });
    var chassis = new THREE.Mesh(boxGeo, boxMat);
    chassis.position.y = 8;

    //create and add wheels
    whl1 = addWheel(10, 3, 10);
    chassis.add(whl1);
    whl2 = addWheel(10, 3, -10);
    chassis.add(whl2);
    whl3 = addWheel(0, 3, 10);
    chassis.add(whl3);
    whl4 = addWheel(0, 3, -10);
    chassis.add(whl4);
    whl5 = addWheel(-10, 3, 10);
    chassis.add(whl5);
    whl6 = addWheel(-10, 3, -10);
    chassis.add(whl6);

    //add solar panel
    chassis.add(addPanel());

    chassis.castShadow = chassis.receiveShadow = true;
    rover = chassis;

    scene.add(chassis);
}

//solar panel
function addPanel() {
    var boxGeo = new THREE.BoxGeometry(20, 0.5, 15);
    var boxMat = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('textures/solar_panel.jpg') });
    var panel = new THREE.Mesh(boxGeo, boxMat);
    panel.rotation.x = Math.PI / 4;
    panel.position.z += 2.5;
    panel.position.y += 8.5;
    return panel;
}


//to rotate wheels
function rotateWheels(dir) {
    whl1.rotation.y += dir * 0.2;
    whl2.rotation.y += dir * 0.2;
    whl3.rotation.y += dir * 0.2;
    whl4.rotation.y += dir * 0.2;
    whl5.rotation.y += dir * 0.2;
    whl6.rotation.y += dir * 0.2;
}