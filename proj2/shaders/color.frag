#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

void main() {
	gl_FragColor = texture2D(uSampler, vTextureCoord);

    if(mod(vTextureCoord.y * 10.0, 2.0) > 1.0) 
    color = vec4(color.rgb*0.5,1.0);
    fragColor = vec4(color.rgb, 1.0);
}


