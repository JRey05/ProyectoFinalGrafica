const CHAMPIONS = 0;
const BASE_CHAMPIONS = 1;
const STAND_CHAMPIONS = 2;
const COPA_DESCARGADA = 3;
const STAND_COPA_DESCARGADA = 4;

const ESCALADO=0;
const ROTACION=1;
const TRANSLACION=2;
const ORBITAR=3;

const EJE_X=0;
const EJE_Y=1;
const EJE_Z=2;

// Elemento de la ventana donde se dibujara.
var canvas = null;

// Contexto renderizable del canvas.
var gl = null;

// Programa de shaders.
var shader_program = null;

// Almacenamiento.
var vao_solid = null;
var vao_wire = null;

// Datos globales auxiliares.
var is_solid = false;
var is_animated = false;
var request;

// Parsed OBJ file
var parsed_model = null;

var axis;
var camera = null;
var free_cam = null;
var sherical_cam = null;

// Locaciones de datos de los shaders.
var loc_world_mat;
var loc_proj_mat;
var loc_color;

// Arreglo de modelos.
var models = [];

// Arreglo de transformaciones. Cada elemento se corresponde con un modelo y almacena su escalado, rotación alrededor de sus ejes, traslación, y rotación con respecto a un punto; respectivamente.
// Las primeras tres transformaciones están representadas mediante vectores (vec3) mientras que la última está representada mediante una terna constituida por el punto
// alrededor del cual se rotará, el eje que define la rotación, y el ángulo de rotación; respectivamente.
var transformations = [];

// Arreglo de matrices de modelado. Cada elemento se corresponde con modelo y almacena la matriz que lo modela.
var model_mats = [];

// Arreglo de colores. Cada elemento se corresponde con un modelo y almacena su color.
var colors = [];

// Tiempo del frame anterior.
var then = 0;

// Tiempo transcurrido.
var delta_time = 0;

// Velocidad de rotación.
var rotation_speed = 22;

/**
 *	Define y carga los modelos, especificando la locación de la posición de sus vértices.
 *	A su vez, establece las transformaciones a aplicar posteriormente.
 */
function loadModels(loc_pos) {
	let champions = new Model(champions_source);
	champions.generateModel(loc_pos);
	models.push(champions);
	let champions_translation = vec3.fromValues(0, 0, 1);
	vec3.add(champions._center, champions._center, champions_translation);
  /*
  let champions_orbitation = [];
	champions_orbitation.push(copaV2._center);
	champions_orbitation.push(vec3.fromValues(0, 1, 0));
	champions_orbitation.push(0);
  */
//	transformations.push([vec3.fromValues(1, 1, 1), vec3.fromValues(0, 0, 0), champions_translation, champions_orbitation]);
	transformations.push([vec3.fromValues(1, 1, 1), vec3.fromValues(0, 0, 0), champions_translation]);

	let champions_base = new Model(champions_base_source);
	champions_base.generateModel(loc_pos);
	models.push(champions_base);
	let champions_base_translation = vec3.fromValues(0, 0, 1);
//	transformations.push([vec3.fromValues(1, 1, 1), vec3.fromValues(0, 0, 0), champions_base_translation, champions_orbitation]);
	transformations.push([vec3.fromValues(1, 1, 1), vec3.fromValues(0, 0, 0), champions_base_translation]);

	let champions_stand = new Model(champions_stand_source);
	champions_stand.generateModel(loc_pos);
	models.push(champions_stand);
	let champions_stand_translation = vec3.fromValues(0, 0, 1);
	vec3.add(champions_stand._center, champions_stand._center, champions_stand_translation);
	transformations.push([vec3.fromValues(1, 1, 1), vec3.fromValues(0, 0, 0), champions_stand_translation]);

	let copaDescargada = new Model(copaV2_source);
	copaDescargada.generateModel(loc_pos);
	models.push(copaDescargada);
  let copaDescargada_scaling = mat3.fromValues(0.05,0.05,0.05);
  let copaDescargada_rotating = mat3.fromValues(-90,0,0);
	let copaDescargada_translation = vec3.fromValues(0, 2*champions_stand._center[1], 0);
	let copaDescargada_orbitation = [];
	copaDescargada_orbitation.push(champions._center);
	copaDescargada_orbitation.push(vec3.fromValues(0, 1, 0));
	copaDescargada_orbitation.push(0);
	transformations.push([copaDescargada_scaling, copaDescargada_rotating, copaDescargada_translation, copaDescargada_orbitation]);

	let standDescargada = new Model(champions_stand_source);
	standDescargada.generateModel(loc_pos);
	models.push(standDescargada);
	let rotors1_translation = vec3.fromValues(0, 0, 0);
	transformations.push([vec3.fromValues(1, 1, 1), vec3.fromValues(0, 0, 0), rotors1_translation, copaDescargada_orbitation]);
}

/**
 *	Aplica las transformaciones de modelado y posicionamiento en el mundo del modelo correspondiente al índice i.
 */
function applyTransformations(i) {
	let scaling = transformations[i][ESCALADO],
		rotation = transformations[i][ROTACION],
		translation = transformations[i][TRANSLACION],
		orbitation = transformations[i][ORBITAR];

	let scaling_mat = null,
		x_rotation_mat = null,
		y_rotation_mat = null,
		z_rotation_mat = null,
		rotation_mat = null,
		translation_mat = null,
		model_mat = mat4.create();

	if (scaling != null && !vec3.exactEquals(scaling, vec3.create(1, 1, 1))) {
		scaling_mat = mat4.create();
		mat4.fromScaling(scaling_mat, scaling);
		mat4.mul(model_mat, scaling_mat, model_mat);
	}
	if (rotation != null && !vec3.exactEquals(rotation, vec3.create())) {
		x_rotation_mat = mat4.create();
		y_rotation_mat = mat4.create();
		z_rotation_mat = mat4.create();
		rotation_mat = mat4.create();
		mat4.fromXRotation(x_rotation_mat, glMatrix.toRadian(rotation[0]));
		mat4.fromYRotation(y_rotation_mat, glMatrix.toRadian(rotation[1]));
		mat4.fromZRotation(z_rotation_mat, glMatrix.toRadian(rotation[2]));
		mat4.mul(rotation_mat, x_rotation_mat, rotation_mat);
		mat4.mul(rotation_mat, y_rotation_mat, rotation_mat);
		mat4.mul(rotation_mat, z_rotation_mat, rotation_mat);
		mat4.mul(model_mat, rotation_mat, model_mat);
	}

	if (translation != null) {
		translation_mat = mat4.create();
		mat4.fromTranslation(translation_mat, translation);
		mat4.mul(model_mat, translation_mat, model_mat);
	}

	if (orbitation != null) {
		let target = orbitation[0];
		let target_axis = orbitation[1];
		let quat_rot = quat.create();
		let inverse = mat4.create();
		let inv_target = vec3.create();
		inv_target = vec3.negate(inv_target, target);
		let rotation = mat4.create();
		let angle = orbitation[2];
		quat.setAxisAngle(quat_rot, target_axis, glMatrix.toRadian(angle));
		mat4.fromRotationTranslation(rotation, quat_rot, target);
		mat4.fromTranslation(inverse, inv_target);
		mat4.mul(rotation, rotation, inverse);
		mat4.mul(model_mat, rotation, model_mat);
	}

	model_mats[i] = model_mat;
}


function onLoad() {
	canvas = document.getElementById('canvas');
	gl = canvas.getContext('webgl2');

	shader_program = ShaderProgramHelper.create(vertex_shader_source, fragment_shader_source);

	let loc_pos = gl.getAttribLocation(shader_program, 'pos');
	loc_color = gl.getUniformLocation(shader_program, 'color');
	loc_world_mat = gl.getUniformLocation(shader_program, 'world_mat');
	loc_proj_mat = gl.getUniformLocation(shader_program, 'proj_mat');

	loadModels(loc_pos);

	for (let i = 0; i < models.length; i++) {
		applyTransformations(i);
	}

	let champions_color = Utils.hex2RgbFloat("#A9A9A9");
	let champions_base_color = Utils.hex2RgbFloat("#DCDCDC");
	let champions_stand_color = Utils.hex2RgbFloat("#8B4513");
	let drone1_color = Utils.hex2RgbFloat("#000000");
	let rotors1_color = Utils.hex2RgbFloat("#9400D3");

	colors.push(vec3.fromValues(champions_color.r, champions_color.g, champions_color.b));
	colors.push(vec3.fromValues(champions_base_color.r, champions_base_color.g, champions_base_color.b));
	colors.push(vec3.fromValues(champions_stand_color.r, champions_stand_color.g, champions_stand_color.b));
	colors.push(vec3.fromValues(drone1_color.r, drone1_color.g, drone1_color.b));
	colors.push(vec3.fromValues(rotors1_color.r, rotors1_color.g, rotors1_color.b));

	gl.enable(gl.DEPTH_TEST);
	gl.clearColor(0.18, 0.18, 0.3, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	axis = new Axis();
	axis.load();

	// Crea las cámaras en base a las dimensiones del canvas.
	free_cam = new FreeCamera(55, canvas.clientWidth / canvas.clientHeight);
	spherical_cam = new SphericalCamera(55, canvas.clientWidth / canvas.clientHeight);
	camera = free_cam;

	if (is_animated) {
		request = requestAnimationFrame(onRender);
	} else {
		onRender();
	}
}

let angle = 0;

function onRender(now) {
	let view_mat = camera.view_mat,
		proj_mat = camera.proj_mat;

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	axis.render(proj_mat, view_mat);

	gl.useProgram(shader_program);
	gl.uniformMatrix4fv(loc_proj_mat, false, proj_mat);

	if (is_animated) {
		// Milisegundos a segundos.
		now *= 0.001;

		if (then == -1) {
			delta_time = 0;
		} else {
			// Obtiene el tiempo transcurrido entre el último frame y el actual.
			delta_time = now - then;
		}
		// Almacena el tiempo actual para el próximo frame.
		then = now;
    if (rotar1) {
      if (rotacionT1) {
    		transformations[CHAMPIONS][ROTACION][EJE_Y] += rotation_speed * delta_time;
    		transformations[BASE_CHAMPIONS][ROTACION][EJE_Y] += rotation_speed * delta_time;
      }
      else {
    		transformations[CHAMPIONS][ROTACION][EJE_Y] -= rotation_speed * delta_time;
    		transformations[BASE_CHAMPIONS][ROTACION][EJE_Y] -= rotation_speed * delta_time;
      }
    }
    if (rotar2) {
      if (rotacionT2) {
        transformations[COPA_DESCARGADA][ROTACION][EJE_Y] += rotation_speed * delta_time;
      }
      else {
        transformations[COPA_DESCARGADA][ROTACION][EJE_Y] -= rotation_speed * delta_time;
      }
    }
    if (orbitando) {
/*      if (orbitaChampions) {
        transformations[CHAMPIONS][ORBITAR][2] -= rotation_speed * delta_time;
      }
*/
//      else {
        transformations[COPA_DESCARGADA][ORBITAR][2] -= rotation_speed * delta_time;
//      }
    }
	} else {
		then = -1;
	}

	for (let i = 0; i < models.length; i++) {
		applyTransformations(i);
		models[i].model_mat = model_mats[i];
		gl.uniform3fv(loc_color, colors[i]);
		models[i].draw(is_solid);
	}

	if (is_animated) {
		request = requestAnimationFrame(onRender);
	}
}
