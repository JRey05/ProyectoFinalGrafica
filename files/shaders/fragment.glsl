// Código del shader de fragmentos, asignado a una variable para usarlo en un tag <script>
var fragment_shader_source = `
	precision highp float;

	uniform vec3 color;

	void main(void) {
		gl_FragColor = vec4(color, 1.0);
}
`