var renderer, scene, camera, cameraMini;
// control de cámara
var cameraControls
// GUI global 
var effectController
// monitor de recursos
//var stats

const L = 10
const Lz = 5

init()
setupGUI()
loadscene()
render()

function init() {
    // Configurar el canvas y el motor de render
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.setClearColor(new THREE.Color(0x000000));
    document.getElementById("container").appendChild(renderer.domElement);
    renderer.autoClear = false     
    // sombras
    renderer.shadowMap.enabled = true
    // antialiasing
    renderer.antialias = true   
    // Instanciar la escena
    scene = new THREE.Scene();
    // Instanciar las camaras
    setCameras()
    // Camara interactiva
    cameraControls = new THREE.OrbitControls(camera,renderer.domElement)
    cameraControls.target.set(0.5*L,0,0)
    // atender evento resize
    window.addEventListener('resize',updateAspectRatio)
    // estadísticas
    /*
    stats = new Stats();
    stats.setMode(0); // muestra FPS
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.bottom = '0px';
    stats.domElement.style.left = '0px';
    document.getElementById('container').appendChild(stats.domElement);
    */
    // luces
    addLights()
}
function setCameras() {
    var ar = window.innerWidth/window.innerHeight
    camera = new THREE.PerspectiveCamera(60,ar,0.1,100)
    camera.position.set(0.5*L,5,8)
    camera.lookAt(new THREE.Vector3(0.5*L,0,0))
    scene.add(camera)
    cameraMini = new THREE.OrthographicCamera(-0.7*L,0.7*L,0.7*L,-0.7*L,-10,3000)    
    cameraMini.position.set(0.5*L,3,0)
    cameraMini.lookAt(new THREE.Vector3(0.5*L,0,0))
    scene.add(cameraMini)
}
function updateAspectRatio(){
    renderer.setSize(window.innerWidth,window.innerHeight)
    camera.aspect = window.innerWidth/window.innerHeight
    camera.updateProjectionMatrix()
}
function setupGUI() {
    // controles
    effectController = {
        algo: [],
        population: 100,
        mutation: 0.001,
        genes: 100,
        obst: [],
        restart: false,
        Generation: '0',
        MaxFitness: '0',
        Winners: '0',
        InitTemp: 100,
        Temp: '1000',
        alpha: 0.8
    };
    // crear interfaz
    var gui = new dat.GUI({  width: 300 });
    gui.add(effectController,"algo",{'Genéticos':1, 'Enf. Simulado':2}).name("Algoritmo");
    gui.add(effectController,"obst",{1:1, 2:2, 3:3}).name("#Obstáculos");     
    gui.add(effectController,"restart").name("Restart");    
    gui.add(effectController,"population",1,200,1).name("Population Size");
    gui.add(effectController,"genes",1,200,1).name("ADN size");  
    gui.add(effectController,"Generation").listen();
    gui.add(effectController,"MaxFitness").listen(); 
    gui.add(effectController,"Winners").listen();    
    var h = gui.addFolder("Genético");        
    h.add(effectController,"mutation",0,0.1,0.0001).name("Mutation Prob.");
    effectController.obst = 1   
    //h.add(effectController,"generation").name("Generation");
    var l = gui.addFolder("Enf. Simulado");   
    l.add(effectController,'InitTemp',0,1000,10).name('Init. Temp')
    l.add(effectController,'alpha',0,1,0.01).name('k')    
    l.add(effectController,'Temp').listen();
}
function addLights() {
    // luces
    var luzAmbiente = new THREE.AmbientLight(0x888888)
    scene.add(luzAmbiente)
    /*
    var luzPuntual = new THREE.PointLight(0xFFFFFF,1) // color e intensidad
    luzPuntual.position.set(0.5*L,1,0)
    scene.add(luzPuntual)
    */
    
    var luzFocal = new THREE.SpotLight(0xFFFFFF,0.6)
    luzFocal.position.set(L,10,0)
    luzFocal.target.position.set(0.5*L,0,0)
    luzFocal.target.updateMatrixWorld()
    luzFocal.angle = Math.PI/5
    luzFocal.penumbra = 0.3
    // sombras
    luzFocal.shadow.camera.near = 1
    luzFocal.shadow.camera.far = 100
    luzFocal.shadow.camera.fov = 80
    luzFocal.shadow.mapSize.width = 1024 // pixeles del buffer que va a usar para renderizar sombras
    luzFocal.shadow.mapSize.height = 1024
    luzFocal.castShadow = true
    scene.add(luzFocal)
}

function loadscene(){
    //scene.add(new THREE.AxisHelper(10));
    loadGround()
    loadPopulation()  
    loadObstacles()  
}
function loadGround() {
    var h = 0.2
    var geometria = new THREE.BoxGeometry(L,h,Lz);
    var textSuelo = new THREE.TextureLoader().load("images/wood512.jpg")
    var material = new THREE.MeshPhongMaterial({
        color: 0x999999,
        side: THREE.DoubleSide,
        map: textSuelo  // textura de superposición
    })    
    var forma = new THREE.Mesh(geometria,material);
    forma.position.set(0.5*L,-0.5*h,0.);
    forma.receiveShadow = true  
    scene.add(forma);
}
var pop;
function loadPopulation(){
    pop = new Population();
    for(var i=0; i<pop.size; i++)
        scene.add(pop.balls[i].mesh)
    pop.Temp = effectController.InitTemp;
    pop.alpha = effectController.alpha;    
    effectController.Temp = pop.Temp.toString();   
    
}
function Obstacle(dx,dz,cx,cz) {
    this.x1 = cx - 0.5*dx;
    this.x2 = cx + 0.5*dx;
    this.z1 = cz - 0.5*dz;
    this.z2 = cz + 0.5*dz;

    this.show = function() {
        var geometria = new THREE.BoxGeometry(dx,0.5,dz);
        var textura = new THREE.TextureLoader().load("images/pisometalico_1024.jpg")
        var material = new THREE.MeshPhongMaterial({
            color: 0xFFFFFF,
            specular: 0x444444,
            shininess: 50,
            map: textura        
      })      
      this.mesh = new THREE.Mesh(geometria,material);
      this.mesh.position.set(cx,0.25,cz);
      this.mesh.receiveShadow = true    
      this.mesh.castShadow = true
      scene.add(this.mesh);
    }
}
var obstacles
var obstNum 
function loadObstacles() {
    obstNum = effectController.obst
    obstacles = [];
    obstacles.push(new Obstacle(1,2,0.4*L,0))
    obstacles.push(new Obstacle(1,2,0.6*L,2))
    obstacles.push(new Obstacle(1,2,0.6*L,-2))
    for(var i=0; i<obstNum; i++) 
        obstacles[i].show();
}

function render() {
    requestAnimationFrame(render);
    update();
    if(window.innerHeight<window.innerWidth)
        renderer.setViewport(0,window.innerHeight*0.6,window.innerHeight*0.4,window.innerHeight*0.4)
    else
        renderer.setViewport(0,window.innerHeight*0.6,window.innerWidth*0.4,window.innerWidth*0.4)
    renderer.render(scene,cameraMini)
    renderer.setViewport(0,0,window.innerWidth,window.innerHeight)
    renderer.render(scene,camera);
}
function update() {
    //stats.update();

    if(effectController.restart) {

        for(var i=0; i<pop.size; i++)
            scene.remove(pop.balls[i].mesh)
        for(var i=0; i<obstacles.length; i++)
            scene.remove(obstacles[i].mesh)
        
        span = effectController.genes
        mutRate = effectController.mutation
        popSize = effectController.population
        obstNum = effectController.obst

        loadObstacles()
        loadPopulation()       
        
        effectController.restart = false
    }

        
    effectController.Generation = genCnt.toString()    
    effectController.Winners = winners.toString()  
    effectController.MaxFitness = maxFitness.toString()  
    effectController.Temp = pop.Temp.toString();   

    for(var i=0; i<obstNum; i++)
        pop.checkColisions(obstacles[i]);

    if(effectController.algo == 1)
        pop.updateGen(L,Lz);
    else if(effectController.algo == 2)
        pop.updateEnf(L,Lz);

}
