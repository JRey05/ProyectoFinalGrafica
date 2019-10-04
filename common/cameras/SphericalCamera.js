/**
 * Camara simple, en coordenadas esféricas.
 * Limitaciones: (Usar solo para pruebas)
 * - Orbita SIEMPRE alrededor del origen.
 * - Apunta SIEMPRE al origen.
 * - Matriz de proyeccion fija.
 */
class SphericalCamera extends Camera {

	constructor(fovy, aspect) {
		super(fovy, aspect);
		this.r = 3;
		this.theta = 90;//degrees
        this.phi = 75; //degrees

	}

	get view_mat() {
		let eye = this._toCartesianArray();
		let target = [0, 0, 0];
		let up = [0, 1, 0];
        // console.log(this._view_mat);
		mat4.lookAt(this._view_mat, eye, target, up);
		return this._view_mat;
    }

	setRadius(radius) {
		this.r = radius;
	}
	setTheta(theta) {
		this.theta = theta;
	}
	setPhi(phi) {
		this.phi = phi;
	}

	getRadius() {
		return this.r;
	}

	getTheta() {
		return this.theta;
	}

	getPhi() {
		return this.phi;
	}

	_toCartesianArray() {
		let _theta = glMatrix.toRadian(this.theta);
		let _phi = glMatrix.toRadian(this.phi);

		let x = this.r * Math.sin(_phi) * Math.cos(_theta);
		let z = this.r * Math.sin(_phi) * Math.sin(_theta);
		let y = this.r * Math.cos(_phi);
		return [x, y, z];
	}
}