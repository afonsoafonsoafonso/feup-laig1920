#version 300 es
precision highp float;

in vec3 aVertexPosition;
in vec2 aTextureCoord;

out vec3 vPosition;
out vec2 vTextureCoord;

void main() {
    gl_Position = vec4(aVertexPosition, 1.0);
    vPosition = aVertexPosition;
    vTextureCoord = aTextureCoord;
}
