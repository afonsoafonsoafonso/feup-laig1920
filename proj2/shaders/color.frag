#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

void main() {
	vec4 color;
	float distance = sqrt(exp2(vTextureCoord.x - 0.0) + exp2(vTextureCoord.y - 0.0	));
	if(distance > 0.4) {
		color = vTextureCoord.x * texture2D(uSampler, vTextureCoord);
	}
	else {
		color = texture2D(uSampler, vTextureCoord);
	}
	gl_FragColor = color;
}


//Aplique gradiente radial no fragment shader de forma a que a cor escureça do centro para os cantos da imagem.