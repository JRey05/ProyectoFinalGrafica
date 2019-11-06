// Código del shader de vértices, asignado a una variable para usarlo en un tag <script>
var vertex_shader_source = `
	precision highp float;
	precision highp int;

	//uniform mat4 model_mat;
	//uniform mat4 view_mat;
	uniform mat4 world_mat;
	uniform mat4 proj_mat;
	uniform mat3 normalMatrix;

	attribute vec3 pos;
	attribute vec3 normal;

	varying vec3 vNE;
	varying vec3 vLE; 
	varying vec3 vVE;
	varying vec3 posicion;
	uniform vec3 lightEye; 

	attribute vec2 vertexTex;

	varying vec2 fTexCoor;

	void main(void) {
		gl_Position = proj_mat * world_mat * vec4(pos, 1.0);
		//gl_Position = proj_mat * view_mat * model_mat * vec4(pos, 1.0);
		posicion= pos;
		fTexCoor=vertexTex;

		vec3 vE= vec3(world_mat* vec4(pos,1.0));
		vLE= normalize(lightEye - vE);	
		vNE= normalize(normalMatrix*normal);	
		vVE= normalize(-vE);	
}
`