class VAOHelper {
	static create(indices, vertex_attributes_info) {
		let vao = gl.createVertexArray();
		let ebo = VAOHelper.createEBO(indices);

		// Crea todos los VBOs.
		let vbos = [];
		for (let attribute of vertex_attributes_info) {
			let currentVBO = VAOHelper.createVBO(attribute.data);
			vbos.push(currentVBO);
		}

		gl.bindVertexArray(vao);

		// Enlaza el EBO.
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);

		// Enlaza los VBO.
		for (let i = 0, count = vbos.length; i < count; i++) {
			let loc = vertex_attributes_info[i].loc;
			let size = vertex_attributes_info[i].size;
			gl.bindBuffer(gl.ARRAY_BUFFER, vbos[i]);
			gl.enableVertexAttribArray(loc);
			gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
		}

		// Desvincula.
		gl.bindVertexArray(null);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		return vao;
	}

	/*
	* Crea y define un VBO.
	*/
	static createVBO(data) {
		let vbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		return vbo;
	}

	/*
	*	Crea y define un EBO.
	*/
	static createEBO(indices) {
		let ebo = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indices), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
		return ebo;
	}
}