// Código del shader de vértices, asignado a una variable para usarlo en un tag <script>
var vertex_shader_source = `
	attribute vec3 pos;

	//uniform mat4 model_mat;
	//uniform mat4 view_mat;
	uniform mat4 world_mat;
	uniform mat4 proj_mat;

	void main(void) {
		gl_Position = proj_mat * world_mat * vec4(pos, 1.0);
		//gl_Position = proj_mat * view_mat * model_mat * vec4(pos, 1.0);
}
`