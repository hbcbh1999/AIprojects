// base
const hBase = 15
const rBase = 50
// eje
const rEje = 20
const hEje = 18
// esparrago
const espX = 18
const espL = 120
const espZ = 12
// rotula
const rRotula = 20
// disco
var hDisco = 6
var rDisco = 22
// nervios
const nervL = 80
const nervX = 4
const nervZ = 4
// manos
const rMano = 15
const hMano = 40
const manoX1 = 19
const manoX2 = 19
const manoY = 20
const manoZ = 4
const x = rMano+0.5*manoX1
const y = 0
const manoZoffset = hMano*0.25

function Robot() {
    // global geometry
    this.geo = new THREE.Object3D()
    // parts
    this.base = new THREE.Object3D()
    this.brazo = new THREE.Object3D()
    this.ante = new THREE.Object3D()
    this.pinza = new THREE.Object3D()
    this.manoIzq = new THREE.Object3D()
    this.manoDer = new THREE.Object3D()
    // textures
    var path = 'images/' 
    this.text1 = new THREE.TextureLoader().load(path+"burberry_256.jpg")
    this.text2 = new THREE.TextureLoader().load(path+"metal_128.jpg")
    this.text3 = new THREE.TextureLoader().load(path+"pisometalico_1024.jpg") 
    var urls = [path+"posx.jpg",path+"negx.jpg",
                path+"posy.jpg",path+"negy.jpg",
                path+"posz.jpg",path+"negz.jpg"]
    this.text4 = new THREE.CubeTextureLoader().load(urls)  
    // materials
    this.mat1 = new THREE.MeshPhongMaterial({
        color: 0xFFFFFF,
        specular: 0x444444,
        shininess: 50,
        map: this.text1        
    })
    this.mat2 = new THREE.MeshLambertMaterial({
        color: 0xFFFFFF,
        map: this.text2        
    })
    this.mat3 = new THREE.MeshPhongMaterial({
        color: 0xFFFFFF,
        specular: 0x444444,
        shininess: 50,
        map: this.text2        
    })
    this.mat4 = new THREE.MeshPhongMaterial({
        color: 0xFFFFFF,
        specular: 0x444444,
        shininess: 50,
        map: this.text3        
    })    
    this.matRot = new THREE.MeshPhongMaterial({
        color: 0xFFFFFF,
        specular: 0x222222,
        shininess: 30,
        envMap: this.text4
    })   
    this.loadRobot = function() {
        this.loadBase()
        this.loadBrazo()
    }
    this.loadBase = function() {
        this.base = new THREE.Mesh(new THREE.CylinderGeometry( rBase, rBase, hBase, 32),this.mat1)
        this.base.position.set(0.,0.5*hBase,0.)
        this.geo.add(this.base)
    }

    this.loadBrazo = function() {
        this.loadEje();
        this.loadEsparrago();
        this.loadRotula();
        this.loadAntebrazo();
        this.geo.add(this.brazo)
    }
    this.loadEje = function() {
        var eje = new THREE.Mesh(new THREE.CylinderGeometry( rEje, rEje, hEje, 32),this.mat2)
        eje.position.set(0.,0.5*hBase,0.);
        eje.rotation.set(0,Math.PI/2,Math.PI/2);
        this.brazo.add(eje)
    }
    this.loadEsparrago = function() {
        var esp = new THREE.Mesh(new THREE.BoxGeometry(espX,espL,espZ),this.mat2)
        esp.position.set(0.,0.5*espL+0.5*hBase,0.)
        this.brazo.add(esp)
    }
    this.loadRotula = function() {
        rot = new THREE.Mesh(new THREE.SphereGeometry( rRotula, 32, 32 ),this.matRot)
        rot.position.set(0.,espL+0.5*hBase,0.)
        this.brazo.add(rot)
    }

    this.loadAntebrazo = function() {
        this.loadDisco();
        this.loadNervios();
        this.loadPinza();
        this.brazo.add(this.ante)
    }
    this.loadDisco = function() {
        this.ante.position.set(0.,espL+0.5*hBase,0.)
        var disco = new THREE.Mesh(new THREE.CylinderGeometry( rDisco, rDisco, hDisco, 32),this.mat3)
        disco.position.set(0,0,0)
        this.ante.add(disco)
    }
    this.loadNervios = function() {
        this.loadNervio(1,1)
        this.loadNervio(-1,1)
        this.loadNervio(-1,-1)
        this.loadNervio(1,-1)
    }
    this.loadNervio = function(a,b) {
        var r = 0.6*rDisco
        var nervio = new THREE.Mesh(new THREE.BoxGeometry(nervX,nervL,nervZ),this.mat3)
        nervio.position.set(a*r*Math.sqrt(2)/2.,0.5*nervL,b*r*Math.sqrt(2)/2.);
        this.ante.add(nervio);
    }
    this.loadPinza = function() {
        this.pinza.position.set(0.,nervL,0.)
        var mano = new THREE.Mesh(new THREE.CylinderGeometry( rMano, rMano, hMano, 32),this.mat4)
        mano.position.set(0,0,0);
        mano.rotation.set(0,Math.PI/2,Math.PI/2);
        this.pinza.add(mano);

        this.loadManoIzquierda();
        this.loadManoDerecha();
        this.ante.add(this.pinza)

    }

    this.loadManoIzquierda = function() {
        var manoIzq1 = new THREE.Mesh(new THREE.BoxGeometry(manoX1,manoY,manoZ),this.mat1)
        manoIzq1.position.set(rMano,0,-manoZoffset);
        this.manoIzq.add(manoIzq1);
    
        var v1 = new THREE.Vector3( x, y+0.5*manoY, -manoZoffset-0.5*manoZ);
        var v2 = new THREE.Vector3( x, y+0.5*manoY, -manoZoffset+0.5*manoZ);
        var v3 = new THREE.Vector3( x, y-0.5*manoY, -manoZoffset+0.5*manoZ);
        var v4 = new THREE.Vector3( x, y-0.5*manoY, -manoZoffset-0.5*manoZ);
    
        var v5 = new THREE.Vector3( x+manoX2, y+0.25*manoY, -manoZoffset );
        var v6 = new THREE.Vector3( x+manoX2, y+0.25*manoY, -manoZoffset+0.5*manoZ);
        var v7 = new THREE.Vector3( x+manoX2, y-0.25*manoY, -manoZoffset+0.5*manoZ);
        var v8 = new THREE.Vector3( x+manoX2, y-0.25*manoY, -manoZoffset);
    
        drawHand(v1,v2,v3,v4,v5,v6,v7,v8,this.manoIzq)
        this.pinza.add(this.manoIzq) 
    
    }
    this.loadManoDerecha = function() {
        var manoDer1 = new THREE.Mesh(new THREE.BoxGeometry(manoX1,manoY,manoZ),this.mat1)
        manoDer1.position.set(rMano,0,manoZoffset);
        this.manoDer.add(manoDer1);
        
        var v1 = new THREE.Vector3( x, y+0.5*manoY, manoZoffset-0.5*manoZ);
        var v2 = new THREE.Vector3( x, y+0.5*manoY, manoZoffset+0.5*manoZ);
        var v3 = new THREE.Vector3( x, y-0.5*manoY, manoZoffset+0.5*manoZ);
        var v4 = new THREE.Vector3( x, y-0.5*manoY, manoZoffset-0.5*manoZ);
        
        var v5 = new THREE.Vector3( x+manoX2, y+0.25*manoY, manoZoffset-0.5*manoZ);
        var v6 = new THREE.Vector3( x+manoX2, y+0.25*manoY, manoZoffset);
        var v7 = new THREE.Vector3( x+manoX2, y-0.25*manoY, manoZoffset);
        var v8 = new THREE.Vector3( x+manoX2, y-0.25*manoY, manoZoffset-0.5*manoZ);
        
        drawHand(v1,v2,v3,v4,v5,v6,v7,v8,this.manoDer)    
        this.pinza.add(this.manoDer) 
    }
}

function addGeometry(geometry,geo){
  geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );
  geometry.computeBoundingSphere();
  var material = new THREE.MeshBasicMaterial({color:"yellow",wireframe:true});
  var forma = new THREE.Mesh(geometry,material);
  geo.add(forma);
}
function drawHand(v1,v2,v3,v4,v5,v6,v7,v8,geo) {
  var geometry = new THREE.Geometry();
  geometry.vertices.push(v1,v2,v3);
  addGeometry(geometry,geo);

  var geometry = new THREE.Geometry();
  geometry.vertices.push(v1,v4,v3);
  addGeometry(geometry,geo);

  var geometry = new THREE.Geometry();
  geometry.vertices.push(v1,v2,v5);
  addGeometry(geometry,geo);

  var geometry = new THREE.Geometry();
  geometry.vertices.push(v2,v6,v5);
  addGeometry(geometry,geo);

  var geometry = new THREE.Geometry();
  geometry.vertices.push(v3,v4,v8);
  addGeometry(geometry,geo);

  var geometry = new THREE.Geometry();
  geometry.vertices.push(v3,v7,v8);
  addGeometry(geometry,geo);

  var geometry = new THREE.Geometry();
  geometry.vertices.push(v5,v6,v7);
  addGeometry(geometry,geo);

  var geometry = new THREE.Geometry();
  geometry.vertices.push(v5,v7,v8);
  addGeometry(geometry,geo);

  var geometry = new THREE.Geometry();
  geometry.vertices.push(v2,v3,v6);
  addGeometry(geometry,geo);

  var geometry = new THREE.Geometry();
  geometry.vertices.push(v3,v6,v7);
  addGeometry(geometry,geo);

  var geometry = new THREE.Geometry();
  geometry.vertices.push(v1,v4,v5);
  addGeometry(geometry,geo);

  var geometry = new THREE.Geometry();
  geometry.vertices.push(v8,v4,v5);
  addGeometry(geometry,geo);
}
