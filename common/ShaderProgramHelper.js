class ShaderProgramHelper {
	static create(vertex_shader_source, fragment_shader_source, attribute_bindings) {
		let vertexShader = ShaderProgramHelper.createShader(gl.VERTEX_SHADER, vertex_shader_source);
		let fragmentShader = ShaderProgramHelper.createShader(gl.FRAGMENT_SHADER, fragment_shader_source);
		let shader_program = gl.createProgram();

		gl.attachShader(shader_program, vertexShader);
		gl.attachShader(shader_program, fragmentShader);
		gl.linkProgram(shader_program);

		// Valida el linkeo y el contexto.
		gl.validateProgram(shader_program);

		// Verifica el resultado de la validación.
		let success = gl.getProgramParameter(shader_program, gl.LINK_STATUS);
		if (!success) {
			let errorMsg = gl.getProgramInfoLog(shader_program);
			gl.deleteProgram(shader_program);
			throw 'No se pudo liinkear el programa: ' + errorMsg;
		}
		gl.deleteShader(vertexShader);
		gl.deleteShader(fragmentShader);

		if (attribute_bindings) {
			ShaderProgramHelper.bindAttributes(shader_program, attribute_bindings);
		}

		return shader_program;
	}

	/*
	*	Crea y compila el shader.
	*/
	static createShader(type, shader_source) {
		let shader = gl.createShader(type);
		gl.shaderSource(shader, shader_source);
		gl.compileShader(shader);

		let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
		if (!success) {
			let name = 'UNKNOW';
			if (type == gl.VERTEX_SHADER) {
				name = 'VERTEX';
			} else if (type == gl.FRAGMENT_SHADER) {
				name = 'FRAGMENT';
			}
			let errorMsg = gl.getShaderInfoLog(shader);
			gl.deleteShader(shader);
			throw "Could not compile " + name + " shader: " + errorMsg;
		}

		return shader;
	}

	/*
	*	Enlaza los atributos manualmente.
	*/
	static bindAttributes(shader_program, attribute_bindings) {
		//Foreach binding do this:
		//gl.bindAttribLocation(this._shader_program, attributeIndex, variableName);
		for (let binding of (attribute_bindings)) {
			gl.bindAttribLocation(shader_program, binding[0], attribute_bindings[1]);
		}
		throw "Not implemented yet!";
	}
}