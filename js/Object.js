class Object {
	constructor(obj_source) {
		this._source = obj_source;
		this._vao_solid = null;
    this._vao_wire = null;
		this._index_count_solid = 0;
    this._index_count_wire = 0;
    this._model_mat = mat4.create();
	}

	generateModel(loc_pos) {
		this._loc_pos = loc_pos;
		let parsed = OBJParser.parseFile(this._source);
		let indices_solid = parsed.indices;
		let indices_wire = Utils.rearrange2Lines(parsed.indices);
		this._index_count_solid = indices_solid.length;
		this._index_count_wire = indices_wire.length;
		let positions = parsed.positions;

		let vertex_attributes_info = [
			new VertexAttributeInfo(positions, this._loc_pos, 3)
		];

		this._vao_solid = VAOHelper.create(indices_solid, vertex_attributes_info);
		this._vao_wire = VAOHelper.create(indices_wire, vertex_attributes_info);

		//Ya tengo los buffers cargados en memoria de la placa grafica, puedo borrarlo de JS.
		parsed = null;
	}

	set model_mat(model_mat) {
		this._model_mat = model_mat;
		this._world_mat = mat4.create();
		mat4.multiply(this._world_mat, camera.view_mat, this._model_mat);
	}

	draw(solid) {
		gl.uniformMatrix4fv(loc_world_mat, false, this._world_mat);

		if (solid) {
			gl.bindVertexArray(this._vao_solid);
			gl.drawElements(gl.TRIANGLES, this._index_count_solid, gl.UNSIGNED_INT, 0);
		} else {
			gl.bindVertexArray(this._vao_wire);
			gl.drawElements(gl.LINES, this._index_count_wire, gl.UNSIGNED_INT, 0);
		}
	}
}
