import vertexShaderSrc from './vertex.glsl.js';
import fragmentShaderSrc from './fragment.glsl.js';


var gl;
var program;
var vao;
var uniformLoc;
var uniformIntLoc;

var currentTriangles;
var currentColor;
var maxTriangles;
var posArray;
var colorArray;
var posBuffer;
var colorBuffer;
var toggled;

window.toggle = function(){
    toggled = !toggled;
    console.log("toggeld = " + toggled);
}

window.openFile = function(event){
    //the json file input should update: maxnumber of triangles, represented as maxTriangles
    //Buffer for position, Buffer for Color

    var input = event.target;

    var reader = new FileReader();
    reader.onload = function(){
        var text = reader.result;
        var parsedObj = JSON.parse(text);
        posArray = parsedObj.positions;
        colorArray = parsedObj.colors;
        maxTriangles = posArray.length / 9;
        document.querySelector("#sliderN").max = maxTriangles;
        //start parsing here?
        /*
        var myArray = text.split("\n");
        var i = 2;
        var totalLine = myArray.length;
        //console.log(myArray);
        
        if(myArray[0] != "{" || !myArray[1].includes("positions")){
            console.log("doesn't look good");
            window.alert("Something went wrong with fileread about position buffer");
            return;
            // alert that file is incorrect format
        }
        
        posArray = [];
        //while myarray[i] does not include ']' and i < myArray.length,
        // see if they have ',' if there is, remove it and make it float and add to the buffer
        while(!myArray[i].includes("]") && i < totalLine){
            if(myArray[i].includes(",")){
                myArray[i] = myArray[i].slice(0, -1);
            }
            posArray.push(parseFloat(myArray[i]));
            //console.log("pushed in :" + parseFloat(myArray[i]));
            i++;
        }
        
        maxTriangles = (i-2) / 9;
        document.querySelector("#sliderN").max = maxTriangles;
        console.log("max triangle : " + maxTriangles);

        if(!myArray[i+1].includes("colors")){
            console.log("doesnt look good");
            posArray = [];
            window.alert("Something went wrong with fileread about color buffer");
            return;
            //  alert that file is incorrect format
        }
        
        colorArray = [];
        i = i+2;
        while(!myArray[i].includes("]") && i < totalLine){
            if(myArray[i].includes(",")){
                myArray[i] = myArray[i].slice(0, -1);
            }
            colorArray.push(parseFloat(myArray[i]));
            //console.log("pushed in :" + parseFloat(myArray[i]));
            i++;
        }

        //console.log(posArray);
        //console.log(colorArray);
        */
        
        var posAttribLoc = gl.getAttribLocation(program, "position");
        var colorAttribLoc = gl.getAttribLocation(program, "color");
        posBuffer = createBuffer(posArray);
        colorBuffer = createBuffer(colorArray);

        vao = createVAO(posAttribLoc, colorAttribLoc);

        window.requestAnimationFrame(render);

    };
    reader.readAsText(input.files[0]);
}

window.updateColor = function(){
    var r = parseInt(document.querySelector("#sliderR").value)/255.0;
    var g = parseInt(document.querySelector("#sliderG").value)/255.0;
    var b = parseInt(document.querySelector("#sliderB").value)/255.0;
    var a = parseInt(document.querySelector("#sliderA").value)/255.0;

    currentColor = [r,g,b,a];
}

window.updateTriangles = function(){
    currentTriangles = parseInt(document.querySelector("#sliderN").value);
    console.log("currentTriangles :" + currentTriangles);
}

function createShader(type, source){
    var shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
        var info = gl.getShaderInfoLog(shader);
        console.log("compilation error: " + info);
    }

    return shader;
}

function createProgram(vertexShader, fragmentShader){
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
        var info = gl.getProgramInfoLog(program);
        console.log("compilation error: " + info);
    }

    return program;
}

function createBuffer(vertices){
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    return buffer;
}

function createVAO(posAttribLoc, colorAttribLoc){
    var vao = gl.createVertexArray();

    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(posAttribLoc);

    var size = 3;
    var type = gl.FLOAT;
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.vertexAttribPointer(posAttribLoc, size, type, false, 0, 0);

    gl.enableVertexAttribArray(colorAttribLoc);
    var size = 4;
    var type = gl.FLOAT;
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorAttribLoc, size, type, false, 0, 0);

    return vao;

}

function initialize(){
    var canvas = document.querySelector("#glcanvas");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    gl = canvas.getContext("webgl2");
    console.log("initializing");
    
    //create shaders
    currentColor = [0,0,0,0];
    var vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSrc);
    console.log("created vertex shder!");
    var fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSrc);
    console.log("created fragment shader!");
    
    //create program
    program = createProgram(vertexShader, fragmentShader);
    uniformLoc = gl.getUniformLocation(program, "uColor");
    uniformIntLoc = gl.getUniformLocation(program, "toggled");
    currentTriangles = 1;
    //make buffer, vao and so on
    
    


}

function render(){
    //console.log("rendering");
    gl.viewport(0,0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);
    console.log(currentColor);
    gl.uniform4fv(uniformLoc, new Float32Array(currentColor));
    if(toggled){
        gl.uniform1i(uniformIntLoc, 1);
    }
    else{
        gl.uniform1i(uniformIntLoc, 0);
    }
    gl.bindVertexArray(vao);

    gl.drawArrays(gl.TRIANGLES, 0, 3*currentTriangles);
    requestAnimationFrame(render);
}

window.onload = initialize;