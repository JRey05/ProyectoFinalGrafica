var canvas = null;

// Contexto renderizable.
var gl = null;

// Programa de shaders.
var shader_program  = null;

// Almacenamiento.
var vao_solid = null; //Geometry to render (stored in VAO).
var vao_wire = null;

// Datos globales auxiliares.
var isSolid = false;
var isAnimated = false;
var indexCountSolid = 0;
var indexCountWire = 0;

var parsedOBJ = null; //Parsed OBJ file

var axis;	//Objeto auxiliar "Ejes"
var camera = null;
var camera2 = null;

// Locaciones de datos de los shaders.
// var loc_pos;
// var loc_model_mat;
// var loc_view_mat;
var loc_world_mat;
var loc_proj_mat;
var loc_color;

// FIXME Mapeo.
// var objects = new Map();
// var transformations = new Map();
// var model_mats = new Map();
// var colors = new Map();

var objects = [];
var transformations = [];
var model_mats = [];
var colors = [];

var then = 0;
var rotationSpeed = 30;
var request;

/**
*	Define y carga los objetos, especificando la locación de la posición de sus vértices.
	*/
	function loadObjects(loc_pos) {
	let table_y = 0.5;
	let table_scale = 0.007;
	let rotors_distance = 0.00001;
	let drone2_scale = 0.005;
	let drone1_scale = drone2_scale * 1.5;
	let drone2_x = 0.6;
	let drone2_z = 0.25;
	let drone2_y_rot = 90;

	let table = new Object(table_source);
	table.generateModel(loc_pos);
	// objects.set('table', table); FIXME Mapeo.
	objects.push(table);
	let table_scaling = vec3.fromValues(table_scale, table_scale, table_scale);
	let table_translation = vec3.fromValues(0, 0, 0);
	transformations.push([table_scaling, vec3.fromValues(0, 0, 0), table_translation]);
	// transformations.set('table', [table_scaling, vec3.fromValues(0, 0, 0), table_translation]); FIXME Mapeo.

	let drone = new Object(drone_source);
	drone.generateModel(loc_pos);
	objects.push(drone);
	// objects.set('drone1', drone); FIXME Mapeo.
	let drone1_scaling = vec3.fromValues(drone1_scale, drone1_scale, drone1_scale);
	let drone1_translation = vec3.fromValues(0, table_y, 0); //TODO obtener la altura del objeto a partir del parser.
	transformations.push([drone1_scaling, vec3.fromValues(0, 0, 0), drone1_translation]);
	// transformations.set('drone1', [drone1_scaling, vec3.fromValues(0, 0, 0), drone1_translation]); FIXME Mapeo.

	let rotors = new Object(rotors_source);
	rotors.generateModel(loc_pos);
	objects.push(rotors);
	// objects.set('rotors1', rotors); FIXME Mapeo.
	let rotors1_scaling = vec3.create();
	vec3.copy(rotors1_scaling, drone1_scaling);
	let rotors1_translation = vec3.fromValues(0, drone1_translation[1] + rotors_distance, 0); //TODO ídem.
	transformations.push([rotors1_scaling, vec3.fromValues(0, 0, 0), rotors1_translation]);
	// transformations.set('rotors1', [rotors1_scaling, vec3.fromValues(0, 0, 0), rotors1_translation]); FIXME Mapeo.

	objects.push(drone);
	// objects.set('drone2', drone); FIXME Mapeo.
	let drone2_scaling = vec3.fromValues(drone2_scale, drone2_scale, drone2_scale);
	let drone2_rotation = vec3.fromValues(0, drone2_y_rot, 0);
	let drone2_translation = vec3.fromValues(drone2_x, table_y, drone2_z); //TODO ídem.
	transformations.push([drone2_scaling, drone2_rotation, drone2_translation]);
	// transformations.set('drone2', [drone2_scaling, drone2_rotation, drone2_translation]); FIXME Mapeo.

	objects.push(rotors);
	// objects.set('rotors2', rotors); FIXME Mapeo.
	let rotors2_scaling = vec3.create();
	vec3.copy(rotors2_scaling, drone2_scaling);
	rotors2_rotation = vec3.create();
	rotors2_rotation = vec3.copy(rotors2_rotation, drone2_rotation);
	rotors2_translation = vec3.fromValues(drone2_x, drone2_translation[1] + rotors_distance, drone2_z); //TODO ídem.
	transformations.push([rotors2_scaling, rotors2_rotation, rotors2_translation]);
	// transformations.set('rotors2', [rotors2_scaling, rotors2_rotation, rotors2_translation]); FIXME Mapeo.
	}
	
	/**
*	Realiza las transformaciones de modelado y posicionamiento, es decir transforma las coordenadas del objecto a coordenadas del mundo.
	*/
//function setObjTransformations(k) { FIXME Mapeo.
function setObjTransformations(i) {
	let scaling = transformations[i][0],
			rotation = transformations[i][1],
			translation = transformations[i][2];

	// FIXME Mapeo.
	// let transformation = transformations.get(k);
	// let scaling = transformation[0],
	// 		rotation = transformation[1],
	// 		translation = transformation[2];

	let scaling_mat = mat4.create(),
			x_rotation_mat = mat4.create(),
			y_rotation_mat = mat4.create(),
			z_rotation_mat = mat4.create(),
			rotation_mat = mat4.create(),
			translation_mat = mat4.create(),
			model_mat = mat4.create();

	if (scaling != null && !vec3.exactEquals(scaling, vec3.create())) {
		mat4.fromScaling(scaling_mat, scaling);
	}

	if (rotation != null && !vec3.exactEquals(rotation, vec3.fromValues(0, 0, 0))) {
		mat4.fromXRotation(x_rotation_mat, glMatrix.toRadian(rotation[0]));
		mat4.fromYRotation(y_rotation_mat, glMatrix.toRadian(rotation[1]));
		mat4.fromZRotation(z_rotation_mat, glMatrix.toRadian(rotation[2]));
		mat4.multiply(rotation_mat, x_rotation_mat, y_rotation_mat);
		mat4.multiply(rotation_mat, z_rotation_mat, rotation_mat);
	}

	mat4.fromTranslation(translation_mat, translation);
	mat4.multiply(model_mat, rotation_mat, scaling_mat);
	mat4.multiply(model_mat, translation_mat, model_mat);
	model_mats[i] = model_mat;

	// FIXME Mapeo.
	// model_mats.set(k, model_mat);
	// objects.get(k)._model_mat = model_mat;
}


function onLoad() {
	canvas = document.getElementById('canvas');
	gl = canvas.getContext('webgl2');

	shader_program = ShaderProgramHelper.create(vertex_shader_source, fragment_shader_source);

	let loc_pos = gl.getAttribLocation(shader_program, 'pos');
	loc_color = gl.getUniformLocation(shader_program, 'color');
	loc_world_mat = gl.getUniformLocation(shader_program, 'world_mat');
	loc_proj_mat = gl.getUniformLocation(shader_program, 'proj_mat');

	loadObjects(loc_pos);

	for (let i = 0; i < objects.length; i++) {
		setObjTransformations(i);
	}

	// FIXME Mapeo.
	// let keys = transformations.keys(),
	// 		element = keys.next(),
	// 		done = element.done,
	// 		k = element.value;
	// while (!done) {
	// 	setObjTransformations(k);
	// 	element = keys.next();
	// 	done = element.done;
	// 	k = element.value;
	// }

	let table_color = Utils.hex2RgbFloat("#FFFFFF");
	let drone1_color = Utils.hex2RgbFloat("#FFFFFF");
	let rotors1_color = Utils.hex2RgbFloat("#FFFFFF");
	let drone2_color = Utils.hex2RgbFloat("#FFFFFF");
	let rotors2_color = Utils.hex2RgbFloat("#FFFFFF");

	colors.push(vec3.fromValues(table_color.r, table_color.g, table_color.b));
	colors.push(vec3.fromValues(drone1_color.r, drone1_color.g, drone1_color.b));
	colors.push(vec3.fromValues(rotors1_color.r, rotors1_color.g, rotors1_color.b));
	colors.push(vec3.fromValues(drone2_color.r, drone2_color.g, drone2_color.b));
	colors.push(vec3.fromValues(rotors2_color.r, rotors2_color.g, rotors2_color.b));

	// FIXME Mapeo.
	// colors.set('table', vec3.fromValues(table_color.r, table_color.g, table_color.b));
	// colors.set('drone1', vec3.fromValues(drone1_color.r, drone1_color.g, drone1_color.b));
	// colors.set('rotors1', vec3.fromValues(rotors1_color.r, rotors1_color.g, rotors1_color.b));
	// colors.set('drone2', vec3.fromValues(drone2_color.r, drone2_color.g, drone2_color.b));
	// colors.set('rotors2', vec3.fromValues(rotors2_color.r, rotors2_color.g, rotors2_color.b));

	gl.enable(gl.DEPTH_TEST);
	gl.clearColor(0.18, 0.18, 0.18, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	axis = new Axis();
	axis.load();
	camera = new FreeCamera(55, canvas.clientWidth/canvas.clientHeight);
	// Create the camera using canvas dimension
	camera2 = new SphericalCamera(55, canvas.clientWidth/canvas.clientHeight);

	if (isAnimated) {
		request = requestAnimationFrame(onRender);
	} else {
		onRender();
	}
}

function onRender(now) {
	// Convert the time to seconds
	if (now !== undefined) {
		now *= 0.001;
		// Subtract the previous time from the current time
		var deltaTime = now - then;
		// Remember the current time for the next frame.
		then = now;

		transformations[4][1][1] += rotationSpeed * deltaTime;
		// transformations.get('rotors2')[1][1] += rotationSpeed * deltaTime; FIXME Mapeo.
	}

	let view_mat = camera.view_mat,
			proj_mat = camera.proj_mat;

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	axis.render(proj_mat, view_mat);

	gl.useProgram(shader_program);
	gl.uniformMatrix4fv(loc_proj_mat, false, proj_mat);

	for (let i = 0; i < objects.length; i++) {
		setObjTransformations(i)
		objects[i].model_mat = model_mats[i];
		gl.uniform3fv(loc_color, colors[i]);
		objects[i].draw(isSolid);
	}

	// FIXME Mapeo.
	// let keys = transformations.keys(),
	// 		element = keys.next(),
	// 		done = element.done,
	// 		k = element.value;
	// while (!done) {
	// 	let obj = objects.get(k),
	// 			model_mat = model_mats.get(k),
	// 			color = colors.get(k);
	// 	setObjTransformations(k)
	// 	// console.log(model_mat);
	// 	obj._model_mat = model_mat;
	// 	gl.uniform3fv(loc_color, color);
	// 	obj.draw(isSolid);
	// 	element = keys.next();
	// 	done = element.done;
	// 	k = element.value;
	// }

	if (isAnimated) {
		request = requestAnimationFrame(onRender);
	}
}
