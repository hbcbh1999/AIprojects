var span = 200;
var cnt = 0;
var genCnt = 0;
var win = 0;
const mutRate = 0.0001;

function Ball(scene) {
    // geometria
    var r = 0.2
    var geo = new THREE.SphereGeometry(r, 32, 32 );
    var mat = new THREE.MeshBasicMaterial({color:"red",wireframe:true});
    var mesh = new THREE.Mesh(geo,mat)
    scene.add(mesh)
    // atributos
    this.pos = new THREE.Vector3(0.,0.,0.);
    this.vel = new THREE.Vector3(0.,0.,0.);
    this.acc = new THREE.Vector3(0.,0.,0.);
    this.adn = new ADN();
    this.count = 0;
    this.fitness = 0.;
    this.end = false;
    this.win = false;
    // métodos
    this.applyForce = function(force){
        this.acc.add(force);
    }
    this.update = function(L,Lz) {
        var x = this.pos.x
        var z = this.pos.z
        if(x > L || x < 0 || z > 0.5*Lz || z < -0.5*Lz || cnt>=span || this.end)
            this.vel.set(0.,0.,0.);
        else {
            this.applyForce(this.adn.genes[cnt]);
            this.vel.add(this.acc)
            this.count++;
        }
        this.pos.add(this.vel);
        this.acc.set(0.,0.,0.);
    }
    this.show = function() {
        mesh.position.set(this.pos.x,this.pos.y,this.pos.z);
    }
    this.computeFitness = function(L) {
        this.fitness = (Math.sqrt(this.pos.x**2 + this.pos.z**2)/L)**2;
        //if (this.win)
        //    this.fitness *= 10;
    }
    this.crossover = function(partner){
        var newGenes = [];
        var p1 = this.adn.genes.length/3.;
        //var p1 = this.adn.genes.length/2.;
        var p2 = 2*p1;
        for (var i=0; i<this.adn.genes.length; i++) {
            if(i<p1 || i>p2)
            //if(i<p1)
                newGenes[i] = this.adn.genes[i];
            else
                newGenes[i] = partner.adn.genes[i];
        }
        return new ADN(newGenes);
    }
    this.mutation = function() {
      for (var i=0; i<this.adn.genes.length; i++)
          if(Math.random()<mutRate)
            this.adn.genes[i].set(0.001*Math.random(),0.,0.1*(Math.random()-0.5));
    }
    this.resetPos = function() {
      this.pos.set(0.,0.,0.);
      this.vel.set(0.,0.,0.);
      this.acc.set(0.,0.,0.);
      this.count = 0;
      this.win = false;
      this.end = false;
    }
    this.checkColisions = function(obstacle) {
      var x = this.pos.x
      var z = this.pos.z
      if(x > obstacle.x1 && x < obstacle.x2 && z > obstacle.z1 && z < obstacle.z2)
          this.end = true;
    }
}
function Population() {
    // atributos
    this.balls = [];
    this.size = 300;
    this.cnt = 0;
    this.pool = [];

    console.log("Generation: ",genCnt)

    for (var i=0; i<this.size; i++)
        this.balls[i] = new Ball(scene);
    // metodos
    this.update = function(L,Lz) {
        for (var i=0; i<this.size; i++){
            this.balls[i].update(L,Lz)
            this.balls[i].show();
        }

        cnt++;
        if (cnt>=span){
            for (var i=0; i<this.size; i++) {
                var x = this.balls[i].pos.x;
                var z = this.balls[i].pos.z;
                if(x > L && z <= 0.5*Lz && z >= -0.5*Lz) {
                    this.balls[i].win = true;
                    win++;
                }
          }
          console.log("Winners: ",win);
          win = 0;
          this.computeFit(L);
          this.selection();
          this.mutation();
          cnt = 0;
          genCnt++;
          console.log("Generation: ",genCnt)
        }
    }
    this.computeFit = function(L)  {
        // calcular fitness
        for (var i=0; i<this.size; i++)
            this.balls[i].computeFitness(L);
        // normalizar
        var max = 0;
        for (var i=0; i<this.size; i++)
            if (this.balls[i].fitness > max)
              max = this.balls[i].fitness
        console.log("Max. Fitness: ", max)
        for (var i=0; i<this.size; i++) {
            this.balls[i].fitness /= max
            //console.log(this.balls[i].fitness)
        }
    }
    this.selection = function() {
      // selección: CAMBIAR POR TORNEO !
      this.pool = [];
      for (var i=0; i<this.size; i++) {
          var n = 1 + this.balls[i].fitness*100;
          for (var j=0; j<n; j++)
              this.pool.push(this.balls[i])
      }
      var newBallsAdn = [];
      for (var i=0; i<this.size; i++) {
          var parentA = this.pool[Math.floor(Math.random()*this.pool.length)];
          var parentB = this.pool[Math.floor(Math.random()*this.pool.length)];
          //console.log(Math.floor(Math.random()*this.pool.length))
          var child = parentA.crossover(parentB);
          newBallsAdn[i] = child;
      }
      for (var i=0; i<this.size; i++) {
          if(!this.balls[i].win) {
              this.balls[i].adn = newBallsAdn[i];
              this.balls[i].resetPos();
          }
      }
    }
    this.mutation = function() {
        for (var i=0; i<this.size; i++) {
            if(!this.balls[i].win)
            this.balls[i].mutation()
        }
    }
    this.checkColisions = function(obstacle) {
        for (var i=0; i<this.size; i++)
          this.balls[i].checkColisions(obstacle);
    }
}
function ADN(genes) {
    if(genes)
        this.genes = genes;
    else {
        this.genes = [];
        for (var i=0; i<span; i++){
            //this.genes[i] = new THREE.Vector3(0.01,0.,0.);
            this.genes[i] = new THREE.Vector3(0.001*Math.random(),0.,0.);
        }
    }
}
