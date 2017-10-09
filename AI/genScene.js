var renderer, scene, camera
const L = 10
const Lz = 5

init()
loadscene()
render()

function init() {
    // Configurar el canvas y el motor de render
    renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth,window.innerHeight)
    renderer.setClearColor(new THREE.Color(0x0000FF))
    //renderer.autoClear = false
    document.getElementById("container").appendChild(renderer.domElement)
    // Instanciar la escena
    scene = new THREE.Scene()
    // Instanciar las camaras
    setCameras()
    // Camara interactiva
    cameraControls = new THREE.OrbitControls(camera,renderer.domElement)
    cameraControls.target.set(0.5*L,0,0)
    // atender evento resize
    window.addEventListener('resize',updateAspectRatio)
}
function setCameras() {
    var ar = window.innerWidth/window.innerHeight
    camera = new THREE.PerspectiveCamera(60,ar,0.1,100)
    camera.position.set(2,5,5)
    camera.lookAt(new THREE.Vector3(0.5*L,0,0))
    scene.add(camera)
}
function updateAspectRatio(){
    renderer.setSize(window.innerWidth,window.innerHeight)
    camera.aspect = window.innerWidth/window.innerHeight
    camera.updateProjectionMatrix()
}
function loadscene(){
    loadGround();
    loadPopulation();
    loadObstacles();
    //scene.add(new THREE.AxisHelper(1));
}
function loadGround() {
    var h = 0.2
    var geometria = new THREE.BoxGeometry(L,h,Lz);
    var material = new THREE.MeshBasicMaterial({color:"yellow",wireframe:true});
    var forma = new THREE.Mesh(geometria,material);
    forma.position.set(0.5*L,-0.5*h,0.);
    scene.add(forma);
}
var pop;
function loadPopulation(){
    pop = new Population(scene);
}

function Obstacle(dx,dz,cx,cz) {
    this.x1 = cx - 0.5*dx;
    this.x2 = cx + 0.5*dx;
    this.z1 = cz - 0.5*dz;
    this.z2 = cz + 0.5*dz;

    this.show = function() {
      var geometria = new THREE.BoxGeometry(dx,0.5,dz);
      var material = new THREE.MeshBasicMaterial({color:"green",wireframe:true});
      var forma = new THREE.Mesh(geometria,material);
      forma.position.set(cx,0.25,cz);
      scene.add(forma);
    }
}
var obstacles;
function loadObstacles() {
    obstacles = [];
    obstacles.push(new Obstacle(1,2,0.4*L,0))
    obstacles.push(new Obstacle(1,2,0.6*L,2))
    obstacles.push(new Obstacle(1,2,0.6*L,-2))
    for(var i=0; i<obstacles.length; i++)
        obstacles[i].show();
}

function update() {
    for(var i=0; i<obstacles.length; i++)
        pop.checkColisions(obstacles[i]);
    pop.update(L,Lz);
}
function render() {
    requestAnimationFrame(render);
    update();
    renderer.render(scene,camera);
}
