class Camera {
	constructor(fovy, aspect) {
		this._fovy = fovy;
		this._aspect = aspect;
		this._z_near = 0.001;
		this._z_far = 100;

		this._proj_mat = mat4.create();
		this._view_mat = mat4.create();
	}

	get proj_mat() {
		let fovy_rad = glMatrix.toRadian(this._fovy);

		mat4.perspective(this._proj_mat, fovy_rad, this._aspect, this._z_near, this._z_far);
		return this._proj_mat;
	}

	set fovy(fovy) {
		this._fovy = fovy;
	}

	set aspect(aspect) {
		this._aspect = aspect;
	}

	get view_mat() {
		throw "getview_mat: Must be implemented by subclasses!"
	}
}