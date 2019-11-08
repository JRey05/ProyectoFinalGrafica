// Código del shader de fragmentos, asignado a una variable para usarlo en un tag <script>
var fragment_shader_source = `
	precision highp float;
	precision highp int;

	varying vec3 vNE;
	varying vec3 vLE;
	varying vec3 vVE;
	varying vec3 posicion;
	uniform mat3 normalMatrix;
	uniform mat4 world_mat;
	uniform mat4 proj_mat;
	uniform sampler2D sampler;

	varying vec2 fTexCoor;

	uniform vec3 color_ka;
	uniform vec3 color_kd;
	uniform vec3 color_ks;
	uniform float aAtt;
	uniform float bAtt;
	uniform float cAtt;
	uniform float enabled;
	uniform vec3 lightColor;
	uniform vec3 spotLightColor;
	uniform vec3 lightEye;

	uniform float lightInt;

	uniform float CoefEsp;
	uniform float Tita;

	uniform vec3 color;

	uniform vec3 spot_pos_E;

	void main(void) {
		vec3 N= normalize(vNE);
		vec3 L= normalize(vLE);
		vec3 R=reflect(L,N);
		vec3 V=normalize(vVE);
		vec3 H=normalize(L+V);
		vec3 vE= vec3(world_mat* vec4(posicion,1.0));
		float d=length(lightEye-vE);
		float fAtt=max(0.0,1.0/(aAtt+(bAtt*d)+(cAtt*(d*d))));
		float m=1.0;

		float NH= length(vNE*(L+V));
		float NV= length(vNE*vVE);
		float VH= length(vVE*(L+V));
		float NL= length(vNE*vLE);
		float Ge=(2.0*NH*NV)/VH;
		float Gs=(2.0*NH*NL)/VH;
		float aux=min(1.0,Ge);
		float G=min(aux,Gs);
		float D2=pow(2.71,(NH*NH-1.0)/(m*m*NH*NH))/(m*m*pow(NH,4.0));
		float spectCT=(fAtt*D2*G)/(3.14*NV*NL);

		vec3 colorAmbiente=lightColor*color_ka*enabled;
		vec3 colorDifuso=lightColor*fAtt*color_kd*NL*enabled;
		vec3 colorEspecular= lightColor*color_ks*spectCT*enabled;
		vec3 color1=colorDifuso+colorEspecular;

		vec3 color3;

		if (dot(normalize(spot_pos_E), -L) > cos(Tita)) {
			color3 = spotLightColor*pow(dot(normalize(spot_pos_E), -L), CoefEsp)*(color_kd + color_ks);
		} else {
			color3 = vec3(.0, .0, .0);
		}
		vec3 color2 = colorAmbiente + lightInt*color1 + color3;
		gl_FragColor = vec4(color2,1.0);

		//gl_FragColor = vec4(color, 1.0);
}
`
