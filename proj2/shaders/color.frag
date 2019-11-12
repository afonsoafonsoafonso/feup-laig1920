#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

void main() {
	vec4 color;
	float distance = sqrt(exp2(vTextureCoord.x - 2.0) + exp2(vTextureCoord.y - 1.5	));
	if(vTextureCoord.x > 0.5 || vTextureCoord.y > 0.5) {
		color = vTextureCoord.x * texture2D(uSampler, vTextureCoord);
	}
	else {
		color = texture2D(uSampler, vTextureCoord);
	}
	gl_FragColor = color;
}


//Aplique gradiente radial no fragment shader de forma a que a cor escureça do centro para os cantos da imagem.