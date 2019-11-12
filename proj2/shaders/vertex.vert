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
//A imagem final da câmara de segurança deverá ter linhas horizontais brancas que se sobrepõem à imagem original (por adição de cor). 
//Use as coordenadas de textura para calcular a intensidade da linha num dado pixel. As linhas deverão ser animadas, movendo-se de baixo para cima, usando um valor de tempo.