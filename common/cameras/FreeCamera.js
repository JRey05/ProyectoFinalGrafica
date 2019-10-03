class FreeCamera extends Camera {
	constructor(fovy, aspect) {
		super(fovy, aspect);
		// Posición de la cámara u ojo.
		this._eye = vec3.fromValues(1.06, 3.74, -0.05);
		// this._eye = vec3.fromValues(0, 0.5, 0);
		// Vector unitario que indica la dirección delantera
		this._forward = vec3.fromValues(-0.34, -0.94, 0);
		// this._forward = vec3.fromValues(-1, 0, 0);
		// Ídem dirección diestra.
		this._right = vec3.fromValues(0, 0, -1);
		// Razón de cambio de poisición.
		this._delta_pos = 0.05;
		// Razón de cambio de rotación.
		this._delta_rot = glMatrix.toRadian(5);
	}

	get view_mat() {
		let eye = this._eye;
		let up = this.up;
		let target = vec3.fromValues(0, 0, 0);
		vec3.add(target, eye, this._forward);

		mat4.lookAt(this._view_mat, eye, target, up);
		return this._view_mat;
	}

	get up() {
		let up = vec3.create();
		vec3.cross(up, this._right, this._forward);
		return vec3.normalize(up, up);
	}

	deltaPos2Vec(unit_dir) {
		let delta_pos_vec = vec3.create();
		vec3.scale(delta_pos_vec, unit_dir, this._delta_pos);
		return delta_pos_vec;
	}

	moveForward() {
		let delta_pos_vec = this.deltaPos2Vec(this._forward);
		vec3.add(this._eye, this._eye, delta_pos_vec);
	}

	moveBackward() {
		let delta_pos_vec = this.deltaPos2Vec(this._forward);
		vec3.sub(this._eye, this._eye, delta_pos_vec);
	}

	moveLeft() {
		let delta_pos_vec = this.deltaPos2Vec(this._right);
		vec3.sub(this._eye, this._eye, delta_pos_vec);
	}

	moveRight() {
		let delta_pos_vec = this.deltaPos2Vec(this._right);
		vec3.add(this._eye, this._eye, delta_pos_vec);
	}

	moveUp() {
		let delta_pos_vec = this.deltaPos2Vec(this.up);
		vec3.add(this._eye, this._eye, delta_pos_vec);
	}

	moveDown() {
		let delta_pos_vec = this.deltaPos2Vec(this.up);
		vec3.sub(this._eye, this._eye, delta_pos_vec);
	}

	yawLeft() {
		this.yaw(this._delta_rot);
	}

	yawRight() {
		this.yaw(-1 * this._delta_rot);
	}

	pitchUp() {
		this.pitch(this._delta_rot);
	}

	pitchDown() {
		this.pitch(-1 * this._delta_rot);
	}

	rollLeft() {
		this.roll(-1 * this._delta_rot);
	}

	rollRight() {
		this.roll(this._delta_rot);
	}

	// Eje Y
	yaw(angle) {
		let quat_rot = quat.create(),
				axis = vec3.create(),
				right = vec3.create(),
				forward = vec3.create();

		vec3.cross(axis, this._right, this._forward);
		vec3.normalize(axis, axis);
		quat.setAxisAngle(quat_rot, axis, angle);
		vec3.transformQuat(right, this._right, quat_rot);
		vec3.transformQuat(forward, this._forward, quat_rot);
		vec3.normalize(forward, forward);
		vec3.normalize(right, right);
		if (Math.abs(right[1]) <= 0.95 && Math.abs(forward[1]) <= 0.95) {
			vec3.copy(this._right, right);
			vec3.copy(this._forward, forward);
		}
	}

	// Eje Z
	roll(angle) {
		let quat_rot = quat.create(),
				axis = vec3.create(),
				right = vec3.create();

		vec3.cross(axis, this.up, this._right);
		vec3.normalize(axis, axis);
		quat.setAxisAngle(quat_rot, axis, angle);
		vec3.transformQuat(right, this._right, quat_rot);
		if (Math.abs(right[1]) <= 0.95) {
			vec3.copy(this._right, right);
		}
	}

	// Eje X
	pitch(angle) {
		let x_rot = quat.create(),
				forward = vec3.create(),
				axis = vec3.create();

		vec3.cross(axis, this._forward, this.up);
		vec3.normalize(axis, axis);
		quat.setAxisAngle(x_rot, axis, angle);
		vec3.transformQuat(forward, this._forward, x_rot);
		if (Math.abs(forward[1]) <= 0.95) {
			vec3.copy(this._forward, forward);
		}
	}
}
