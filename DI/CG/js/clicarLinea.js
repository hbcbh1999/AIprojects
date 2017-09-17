/*
  Dibujar puntos que el usuario clica y unirlos con linea.
  El color depnde de la posición al centro
*/

// SHADER DE VERTICES
var VSHADER_SOURCE =
'attribute vec3 posicion;     \n' +
'attribute vec3 color;        \n' +
'varying highp vec3 color2;   \n' +
'void main() {                \n' +
' gl_Position = vec4(posicion, 1.0);     \n' +
' gl_PointSize = 10.0;        \n' +
' color2 = color;             \n' +
'}                            \n';
// SHADER DE FRAGMENTOS
var FSHADER_SOURCE =
'varying highp vec3 color2;                   \n' +
'void main() {                                \n' +
'  gl_FragColor = vec4(color2, 1.0);  \n' +
//'  gl_FragColor = color2;                     \n' +
'}                                            \n';

function main(){
  var canvas = document.getElementById("canvas");
  if(!canvas){
    console.log("Fallo al recuperar el canvas");
    return;
  }
  // conseguir el contexto de dibujo
  var gl = getWebGLContext(canvas);
  if(!gl){
    console.log("Fallo al recuperar el contexto webgl");
    return;
  }
  // Inicializar shaders
  if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)){
    console.log("Fallo al compilar los shaders");
    return;
  }
  // borrar la pantalla
  gl.clearColor(0.0,0.0,0.0,1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  // Atender al evento de click del usuario
  canvas.onmousedown = function(evento){
    click(evento,gl,canvas);
  }
  // puntos que se clican
  var puntos = [];
  var col = [];
  function click(evento, gl, canvas){
    var x = evento.clientX; // x respecto del documento, con origen arriba a la izquierda
    var y = evento.clientY;  // y respecto del documento
    var rect = evento.target.getBoundingClientRect(); // dimensiones del canvas
    // Cambio de sistema de referencia a un cuadrado de 2x2 ( COMPROBAR !! )
    x = ((x-rect.left)-canvas.width/2)*2/canvas.width;
    y = (canvas.height/2-(y-rect.top))*2/canvas.height;
    // guardo las coordenadas
    puntos.push(x);
    puntos.push(y);
    // cambio de color
    var dMax = Math.sqrt(2.); // esquina superior derecha en (1,1)
    var dn = Math.sqrt(x*x + y*y)/dMax; // dn <= 1 siempre
    col.push(1.0 - dn); // red
    col.push(1.0 - dn); // green
    col.push(1.0 - dn); // blue
    // asigno buffers coordenadas
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    var coordenadas = gl.getAttribLocation(gl.program, 'posicion');
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(puntos), gl.STATIC_DRAW);
    gl.vertexAttribPointer(coordenadas, 2, gl.FLOAT, false, 0, 0);
    // el 2 es para que coga un punto cada dos coordenadas (x,y). Para (x,y,z) poner 3
    gl.enableVertexAttribArray(coordenadas);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    // asigno buffer color
    var buffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer2);
    var color = gl.getAttribLocation(gl.program, 'color');
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(col), gl.STATIC_DRAW);
    gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 0, 0);
    // el 3 es para que coga 3 valores del vector para cada color RGB
    gl.enableVertexAttribArray(color);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    // borro y dibujo
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, puntos.length*0.5);
    // el numero de puntos es el tamaño del vector entre 2 porque cada punto esta definido con (x,y)
    // para (x,y,z) habria que dividir entre 3
    gl.drawArrays(gl.LINE_STRIP, 0, puntos.length*0.5);
  }
}
