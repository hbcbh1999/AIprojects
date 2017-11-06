const r = 0.2
var geo = new THREE.SphereGeometry(r, 32, 32 );
var matP = new THREE.MeshPhongMaterial({
    color: 0x000000,
    specular: 0x444444,
    shininess: 50       
})

var span = 100;
var cnt = 0;
var genCnt = 0;
var winners = 0;
var mutRate = 0.001;
var popSize = 100;
var maxFitness = 0;

function Ball() {
    // geometria
    this.mat = new THREE.MeshLambertMaterial({
        color: 0xFF0000    
    })
    this.mesh = new THREE.Mesh(geo,this.mat)
    this.mesh.position.set(0,r,0)
    this.mesh.receiveShadow = true    
    this.mesh.castShadow = true
    // atributos
    this.pos = new THREE.Vector3(0.,r,0.)
    this.vel = new THREE.Vector3(0.,0.,0.)
    this.acc = new THREE.Vector3(0.,0.,0.)
    this.adn = new ADN()
    this.fitness = 0.
    this.end = false
    this.win = false
    this.mutated = false
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
        this.mesh.position.set(this.pos.x,this.pos.y,this.pos.z);
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
        for (var i=0; i<this.adn.genes.length; i++) {
            if(Math.random()<mutRate) {
                this.adn.genes[i].set(0.01*Math.random(),0.,0.05*(Math.random()-0.5));
                this.mesh.material.color.setHex(0x00FF00)
                this.mutated = true
            }
        }
    }
    this.newAdn = function () {
        for (var i=0; i<this.adn.genes.length; i++) {            
            this.adn.genes[i].set(0.01*Math.random(),0.,0.05*(Math.random()-0.5));
            this.mesh.material.color.setHex(0x00FF00);
            this.mutated = true            
        }
    }
    this.setBestMat = function () {
        this.mesh.material.color.setHex(0xFFFFFF)
    }
    this.resetPos = function() {
        this.pos.set(0.,r,0.);
        this.vel.set(0.,0.,0.);
        this.acc.set(0.,0.,0.);
        this.end = false;
        this.mesh.material.color.setHex(0xFF0000)     
        this.mutated = false         
    }
    this.resetPos2 = function() {
        if(!this.win) {
            this.pos.set(0.,r,0.);
            this.vel.set(0.,0.,0.);
            this.acc.set(0.,0.,0.);
            this.end = false;
            if(this.mutated==false)
                this.mesh.material.color.setHex(0xFF0000)     
            this.mutated = false    
        } else {
            this.mesh.material.color.setHex(0xFF0000) 
        }    
    }
    this.checkColisions = function(obstacle) {
        var x = this.pos.x + r
        var z = this.pos.z + r
        if(x > obstacle.x1 && x < obstacle.x2 && z > obstacle.z1 && z < obstacle.z2)
            this.end = true;
    }
}

function Population() {
    // atributos
    this.balls = [];
    this.size = popSize;
    this.pool = [];
    genCnt = 0
    cnt = 0
    winners = 0
    maxFitness = 0
    this.Temp = 10; // temperatura
    this.best = 0; // best ball
    this.apha = 1;

    for (var i=0; i<this.size; i++) {
        this.balls[i] = new Ball();;
    }
    
    console.log("Generation: ",genCnt)    
    
    this.checkColisions = function(obstacle) {
        for (var i=0; i<this.size; i++)
            this.balls[i].checkColisions(obstacle);
    }

    // Métodos genéticos
    this.updateGen = function(L,Lz) {
        for (var i=0; i<this.size; i++){
            this.balls[i].update(L,Lz)
            this.balls[i].show();
        }
        cnt++;

        if (cnt>=span){
            winners = 0
            for (var i=0; i<this.size; i++) {
                var x = this.balls[i].pos.x;
                var z = this.balls[i].pos.z;
                if(x > L && z <= 0.5*Lz && z >= -0.5*Lz) {
                    this.balls[i].win = true;
                    //this.balls[i].mesh.material.color.setHex(0x0000FF)
                    winners++;
                }
            }
            if(winners != this.size) {
                console.log("Winners: ",winners);
                this.computeFit(L);
                this.select();
                this.mutation();
                cnt = 0;
                genCnt++;
                console.log("Generation: ",genCnt)
            }
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
        maxFitness = max
        console.log("Max. Fitness: ", max)
        for (var i=0; i<this.size; i++) {
            this.balls[i].fitness /= max
            //console.log(this.balls[i].fitness)
        }
    }
    this.select = function() {
        // selección: CAMBIAR POR TORNEO !
        this.pool = [];
        for (var i=0; i<this.size; i++) {
            var n = 1 + this.balls[i].fitness*100;
            for (var j=0; j<n; j++)
                this.pool.push(this.balls[i])
        }
        var newBallsAdn = [];
        for (var i=0; i<this.size; i++) {
            if(!this.balls[i].win) {
                var parentA = this.pool[Math.floor(Math.random()*this.pool.length)];
                var parentB = this.pool[Math.floor(Math.random()*this.pool.length)];
                var child = parentA.crossover(parentB);
                newBallsAdn[i] = child;
            } else {
                newBallsAdn[i] = this.balls[i].adn;                
            }
        }
        for (var i=0; i<this.size; i++) {
            this.balls[i].adn = newBallsAdn[i];
            if(!this.balls[i].win)
                this.balls[i].resetPos();
        }
    }
    this.mutation = function() {
        for (var i=0; i<this.size; i++) {
            if(!this.balls[i].win)
                this.balls[i].mutation()
        }
        for (var i=0; i<this.size; i++) 
            if(this.balls[i].mutated)
                console.log(i+" mutated")            
    }
    // Métodos enfriamiento
    this.updateEnf = function(L,Lz) {
        for (var i=0; i<this.size; i++){
            this.balls[i].update(L,Lz)
            this.balls[i].show();
        }
        cnt++;

        if (cnt>=span){
            winners = 0
            for (var i=0; i<this.size; i++) {
                var x = this.balls[i].pos.x;
                var z = this.balls[i].pos.z;
                if(x > L && z <= 0.5*Lz && z >= -0.5*Lz) {
                    this.balls[i].win = true;
                    //this.balls[i].mesh.material.color.setHex(0x0000FF)
                    winners++;
                }
            }
            if(winners != this.size) {
                console.log("Winners: ",winners);
                this.computeFit(L);
                this.selectionEnf();
                this.Temp *= this.alpha;
                cnt = 0;
                genCnt++;
                console.log("Generation: ",genCnt)
            }
        }
    }
    this.selectionEnf = function() {
        for (var i=0; i<this.size; i++) {
            var df = this.balls[i].fitness - this.balls[this.best].fitness;
            //console.log(df)
            if (df >= 0) {
                // mejora la mejor solución
                this.best = i;
                //console.log(i+' mejora')
            } else {
                // probabilidad de ser aceptado
                var prob = Math.exp(df/this.Temp);
                //console.log(i,prob)
                if(Math.random() < prob) {
                    // se acepta
                } else {
                    console.log('sustituyo',i,prob)
                    // sustituyo esta bola por una nueva
                    this.balls[i].newAdn();  
                }
            }
        }        
        for (var i=0; i<this.size; i++) {
            this.balls[i].resetPos2();
        }
        this.balls[this.best].setBestMat();
        console.log(this.best)
    }


}

function ADN(genes) {
    if(genes)
        this.genes = genes;
    else {
        this.genes = [];
        for (var i=0; i<span; i++){
            //this.genes[i] = new THREE.Vector3(0.01,0.,0.);
            this.genes[i] = new THREE.Vector3(0.005*Math.random(),0.,0.);
        }
    }
}