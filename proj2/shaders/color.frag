#version 300 es
precision highp float;

in vec3 vPosition;
in vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform vec2 imageCenter; 
uniform float time;

out vec4 fragColor;

void main() {

    vec4 originalColor = texture(uSampler, vTextureCoord);

    vec2 centerToPos = imageCenter - vec2(vPosition.xy);
    float dist = length(centerToPos);

    float perc = 1.0 - (dist/0.25);

    vec4 color = vec4(originalColor.xyz * perc, 1);

    float offset = sin((vTextureCoord.y - time) * 20.0) + 1.0;

    fragColor = color + offset * 0.3;
}

//Aplique gradiente radial no fragment shader de forma a que a cor escureça do centro para os cantos da imagem.