class Axis {

	vertex_shader_source() {
		return `
		attribute vec3 pos;
		attribute vec3 color;
		uniform mat4 proj_mat;
		uniform mat4 view_mat;
		varying vec3 v_color;

		void main(void) {
			v_color = color;
			gl_Position = proj_mat * view_mat * vec4(pos, 1.0);
		}
		`;
	}

	fragment_shader_source() {
		return `
		precision mediump float;
		varying vec3 v_color;

		void main(void) {
			gl_FragColor = vec4(v_color, 1.0);
		}
		`;
	}

	load() {
		let positions = [
			0, 0, 0, 1, 0, 0, //+x
			0, 0, 0, 0, 1, 0, //+y
			0, 0, 0, 0, 0, 1, //+z
			0, 0, 0, -1, 0, 0, //-x
			0, 0, 0, 0, -1, 0, //-y
			0, 0, 0, 0, 0, -1 //-z
		];
		let negI = 0.3;
		let colors = [
			1, 0, 0, 1, 0, 0,
			0, 1, 0, 0, 1, 0,
			0, 0, 1, 0, 0, 1,
			negI, 0, 0, negI, 0, 0,
			0, negI, 0, 0, negI, 0,
			0, 0, negI, 0, 0, negI
		];
		let auxSlots = 4;
		let step = -1;
		for (let i = 0; i <= 2 * auxSlots; i++) {
			if (i != auxSlots) {
				positions.push(-1);
				positions.push(0);
				positions.push(step);

				positions.push(1);
				positions.push(0);
				positions.push(step);

				positions.push(step);
				positions.push(0);
				positions.push(-1);

				positions.push(step);
				positions.push(0);
				positions.push(1);
			}
			step = step + (1.0 / auxSlots);
		}
		for (let i = colors.length; i < positions.length; i++) {
			colors.push(0.5);
		}
		let indices = [];
		this.index_count = positions.length / 3;
		for (let i = 0; i < this.index_count; i++) {
			indices.push(i);
		}

		this.shader_program = ShaderProgramHelper.create(
			this.vertex_shader_source(),
			this.fragment_shader_source()
		);
		let loc_pos = gl.getAttribLocation(this.shader_program, 'pos');
		let loc_color = gl.getAttribLocation(this.shader_program, 'color');
		this.loc_proj_mat = gl.getUniformLocation(this.shader_program, 'proj_mat');
		this.loc_view_mat = gl.getUniformLocation(this.shader_program, 'view_mat');
		let vertexAttributeInfoArray = [
			new VertexAttributeInfo(positions, loc_pos, 3),
			new VertexAttributeInfo(colors, loc_color, 3)
		];

		this._vao = VAOHelper.create(indices, vertexAttributeInfoArray);
	}

	render(proj_mat, view_mat) {
		gl.useProgram(this.shader_program);
		gl.uniformMatrix4fv(this.loc_proj_mat, false, proj_mat);
		gl.uniformMatrix4fv(this.loc_view_mat, false, view_mat);

		gl.bindVertexArray(this._vao);
		gl.drawElements(gl.LINES, this.index_count, gl.UNSIGNED_INT, 0);
		gl.bindVertexArray(null);

		gl.useProgram(null);
	}
}