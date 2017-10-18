var renderer, scene, camera, cameraMini;
// control de cámara
var cameraControls
// GUI global 
var effectController
const L = 100
var marco
// robot
var robot

// Acciones
init()
loadscene()
setupGUI()
render()

function init() {
    // Configurar el canvas y el motor de render
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.autoClear = false    
    document.getElementById("container").appendChild(renderer.domElement);
    // sombras
    renderer.shadowMap.enabled = true
    // antialiasing
    renderer.antialias = true
    // Instanciar la escena
    scene = new THREE.Scene();
    // Instanciar la camara
    setCameras()
    // Camara interactiva
    cameraControls = new THREE.OrbitControls(camera,renderer.domElement)
    cameraControls.target.set(0,100,0)
    // atender evento resize
    window.addEventListener('resize',updateAspectRatio)
    window.addEventListener('keydown',moveRobot)    
    // crear los marcos
    setFrames()
    // luce
    addLights()
}
function setCameras() {
    var ar = window.innerWidth/window.innerHeight    
    camera = new THREE.PerspectiveCamera(75,ar,0.1,3000)
    camera.position.set(200,200,100);
    camera.lookAt(new THREE.Vector3(0,100,0))
    scene.add(camera)
    cameraMini = new THREE.OrthographicCamera(-L,L,L,-L,-10,3000)    
    cameraMini.position.set(0,500,0)
    cameraMini.lookAt(new THREE.Vector3(0,0,0))
    scene.add(cameraMini)
}
function setFrames() {
    var geo = new THREE.Geometry()
    geo.vertices.push(new THREE.Vector3(-1,-1,0),
                      new THREE.Vector3(1,-1,0),
                      new THREE.Vector3(1,1,0),
                      new THREE.Vector3(-1,1,0),
                      new THREE.Vector3(-1,-1,0))
    marco = new THREE.Line(geo,new THREE.LineBasicMaterial({color:"green"}))
    marco.rotation.set(Math.PI/2.,0,0)
    marco.scale.set(cameraMini.right*0.99,cameraMini.top*0.99,1)    
    marco.visible = false
    scene.add(marco)   
}
function addLights() {
     // luces
     var luzAmbiente = new THREE.AmbientLight(0x666666)
     scene.add(luzAmbiente)
     
     var luzPuntual = new THREE.PointLight(0xFFFFFF,1) // color e intensidad
     luzPuntual.position.set(50,50,-50)
     scene.add(luzPuntual)
     
     var luzFocal = new THREE.SpotLight(0xFFFFFF,0.3)
     luzFocal.position.set(-100,300,100)
     luzFocal.target.position.set(0,100,0)
     luzFocal.angle = Math.PI/5
     luzFocal.penumbra = 0.3
     // sombras
     luzFocal.shadow.camera.near = 1
     luzFocal.shadow.camera.far = 5000
     luzFocal.shadow.camera.fov = 80
     luzFocal.shadow.mapSize.width = 1024 // pixeles del buffer que va a usar para renderizar sombras
     luzFocal.shadow.mapSize.height = 1024
     luzFocal.castShadow = true
     scene.add(luzFocal)
}
function updateAspectRatio(){
    // nuevo tamaño del renderer
    renderer.setSize(window.innerWidth,window.innerHeight)
    // nueva relación de aspect
    var ar = window.innerWidth/window.innerHeight
    cameraMini.left = -L
    cameraMini.right = L
    cameraMini.top = L
    cameraMini.bottom = -L
    camera.aspect = ar
    camera.updateProjectionMatrix()
    cameraMini.updateProjectionMatrix()
    //marco.scale.set(cameraMini.right*0.75,cameraMini.top,1)        
}
function moveRobot(e) {
    if(e.keyCode=='37') {
        robot.geo.position.z += 10
        cameraMini.position.z += 10
        marco.position.z += 10
    } else if(e.keyCode=='38') {
        robot.geo.position.x -= 10
        cameraMini.position.x -= 10
        marco.position.x -= 10
    } else if(e.keyCode=='39') {
        robot.geo.position.z -= 10
        cameraMini.position.z -= 10
        marco.position.z -= 10
    } else if(e.keyCode=='40') {
        robot.geo.position.x += 10
        cameraMini.position.x += 10
        marco.position.x += 10
    } 
}

function loadscene(){
    // suelo
    loadGround();
    // robot
    robot = new Robot()
    robot.loadRobot()
    robot.geo.traverse(function(hijo){
        if(hijo instanceof THREE.Mesh) {
            hijo.receiveShadow = true
            hijo.castShadow = true
        }
    })
    scene.add(robot.geo)
    // habitación
    loadRoom()
    //ejes
    //scene.add(new THREE.AxisHelper(80));                   
}
function loadGround() {
    var geometria = new THREE.BoxGeometry(1000,1,1000);
    var textSuelo = new THREE.TextureLoader().load("images/wood512.jpg")
    textSuelo.magFilter = THREE.LinearFilter
    textSuelo.minFilter = THREE.LinearFilter
    var material = new THREE.MeshPhongMaterial({
        color: 0x999999,
        side: THREE.DoubleSide,
        map: textSuelo  // textura de superposición
    })
    var suelo = new THREE.Mesh(geometria,material);
    suelo.receiveShadow = true        
    scene.add(suelo);
}
function loadRoom() {
    // habitación
    var path = 'images/'    
    var urls = [path+"posx.jpg",path+"negx.jpg",
                path+"posy.jpg",path+"negy.jpg",
                path+"posz.jpg",path+"negz.jpg"]
    var textRoom = new THREE.CubeTextureLoader().load(urls)                
    var shader = THREE.ShaderLib.cube 
    shader.uniforms.tCube.value = textRoom
    var wallsMaterial = new THREE.ShaderMaterial({
        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: shader.uniforms,
        depthWrite: false,
        side: THREE.BackSide
    })
    var hab = new THREE.Mesh(new THREE.CubeGeometry(2000,2000,2000),wallsMaterial)
    hab.position.set(0,200,0)
    scene.add(hab)
}
function setupGUI() {
    // controles
    effectController = {
        giroBase: 0,
        giroBrazo: 0,
        giroAnteY: 0,
        giroAnteZ: 0,
        giroPinza: 0,
        sepPinza: 0
    };
    // crear interfaz
    var gui = new dat.GUI();
    var h = gui.addFolder("Control Robot");
    h.add(effectController,"giroBase",-180,180,1).name("Giro Base");
    h.add(effectController,"giroBrazo",-45,45,1).name("Giro Brazo");
    h.add(effectController,"giroAnteY",-180,180,1).name("Giro Antebrazo Y");
    h.add(effectController,"giroAnteZ",-90,90,1).name("Giro Antebrazo Z");
    h.add(effectController,"giroPinza",-40,220,1).name("Giro Pinza");
    h.add(effectController,"sepPinza",0,15,0.2).name("Separación Pinza");
}

function render() {
    requestAnimationFrame(render);
    update();
    if(window.innerHeight<window.innerWidth)
        renderer.setViewport(0,window.innerHeight*0.75,window.innerHeight*0.25,window.innerHeight*0.25)
    else
        renderer.setViewport(0,window.innerHeight*0.75,window.innerWidth*0.25,window.innerWidth*0.25)
    marco.visible = true
    renderer.render(scene,cameraMini)
    marco.visible = false
    renderer.setViewport(0,0,window.innerWidth,window.innerHeight)
    renderer.render(scene,camera);
}
function update() {   
    robot.geo.rotation.y = effectController.giroBase*(Math.PI/180.)
    robot.brazo.rotation.z = effectController.giroBrazo*(Math.PI/180.)
    robot.ante.rotation.y = effectController.giroAnteY*(Math.PI/180.)
    robot.ante.rotation.z = effectController.giroAnteZ*(Math.PI/180.)
    robot.pinza.rotation.z = effectController.giroPinza*(Math.PI/180.)  
    robot.manoIzq.position.z = (-0.5)*effectController.sepPinza
    robot.manoDer.position.z = (0.5)*effectController.sepPinza
}