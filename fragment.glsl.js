export default `#version 300 es

precision highp float;

uniform vec4 uColor;
uniform int toggled;

in vec4 vColor;
out vec4 outColor;

void main(){
    if(toggled > 0){
        outColor = vColor;
    }
    else{
        outColor = uColor;
    }
}
`;