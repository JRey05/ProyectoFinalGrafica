// Definir constantes.
// Seran los indices en el arreglo de objetos
const CHAMPIONS = 0;
const BASE_CHAMPIONS = 1;
const STAND_CHAMPIONS = 2;
const COPA_DESCARGADA = 3;
const STAND_COPA_DESCARGADA = 4;
const STAND_PELOTA = 5;
const BASE_PELOTA = 6;
const PELOTA = 7;
const SOPORTE_PELOTA = 8;
const MARCO_CUADRO = 9;
const SUELO = 10;
const PAREDES = 11;
const TECHO = 12;

// Seran los indices que indican las transformaciones.
const ESCALADO=0;
const ROTACION=1;
const TRASLACION=2;

// Seran los indices que indican los ejes.
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
// var is_animated = false;
var rotar1 = false;
var rotar2 = false;
var rotacionT1 =true;
var rotacionT2 =false;
var request = null;

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
var u_normalMatrix

var u_color_ka;
var u_color_kd;
var u_color_ks;
var u_CoefEsp;
var u_lightInt;
var u_lightEye;
var u_lightColorA;
var u_lightColorD;
var u_lightColorE;
var u_enableA;
var u_enableD;
var u_enableE;
var aAtt=0.2;
var bAtt=0.2;
var cAtt=0.2;
var u_aAtt;
var u_bAtt;
var u_cAtt;
var u_sampler;
var lightX=1.0;
var lightY=0.0;
var lightZ=600.0;

var color_ka = [0.0,1.0,1.0];
var color_kd = [0.0,1.0,0.0];
var color_ks = [1.0,1.0,1.0];
var CoefEsp = 40;
var lightInt = 1.0;
var lightColorA= [1.0,0.0,0.0];
var lightColorD= [1.0,1.0,1.0];
var lightColorE= [0.2,0.0,0.2];
var enableA = 1.0;
var enableD = 1.0;
var enableE = 1.0;
var miTextura;


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
	* Verifica si se requiere una animación.
	*/
function isAnimated() {
	return (rotar1 || rotar2);
}

/**
 *	Define y carga los modelos, especificando la locación de la posición de sus vértices.
 *	A su vez, establece las transformaciones a aplicar posteriormente.
 */
function loadModels(loc_pos) {
	let champions = new Model(champions_source);
	champions.generateModel(loc_pos);
	models.push(champions);
	let champions_translation = vec3.fromValues(0, 1010, 0);
	vec3.add(champions._center, champions._center, champions_translation);
	let champions_rotating = mat3.fromValues(-90,0,0);
	transformations.push([vec3.fromValues(1, 1, 1), champions_rotating, champions_translation]);

	let champions_base = new Model(base_giratoria_source);
	champions_base.generateModel(loc_pos);
	models.push(champions_base);
	let champions_base_translation = vec3.fromValues(0, 0, 1);
	transformations.push([vec3.fromValues(1, 1, 1), vec3.fromValues(0, 0, 0), champions_base_translation]);

	let champions_stand = new Model(stand_giratorio_source);
	champions_stand.generateModel(loc_pos);
	models.push(champions_stand);
	let champions_stand_translation = vec3.fromValues(0, 0, 1);
	vec3.add(champions_stand._center, champions_stand._center, champions_stand_translation);
	transformations.push([vec3.fromValues(1, 1, 1), vec3.fromValues(0, 0, 0), champions_stand_translation]);

	let copaDescargada = new Model(copaDescargada_source);
	copaDescargada.generateModel(loc_pos);
	models.push(copaDescargada);
  let copaDescargada_scaling = mat3.fromValues(5,5,5);
  let copaDescargada_rotating = mat3.fromValues(0,0,0);
	let copaDescargada_translation = vec3.fromValues(-1000, 1000, 0);
	vec3.add(copaDescargada._center, copaDescargada._center, copaDescargada_translation);
	transformations.push([copaDescargada_scaling, copaDescargada_rotating, copaDescargada_translation]);

	let standDescargada = new Model(standV2_source);
	standDescargada.generateModel(loc_pos);
	models.push(standDescargada);
	let standDescargada_translation = vec3.fromValues(-1000, 0, 0);
	transformations.push([vec3.fromValues(1, 1, 1), vec3.fromValues(0, 0, 0), standDescargada_translation]);

	let standPelota = new Model(standV2_source);
	standPelota.generateModel(loc_pos);
	models.push(standPelota);
	let standPelota_translation = vec3.fromValues(1000, 0, 0);
	transformations.push([vec3.fromValues(1, 1, 1), vec3.fromValues(0, 0, 0), standPelota_translation]);

	let basePelota = new Model(base_giratoria_source);
	basePelota.generateModel(loc_pos);
	models.push(basePelota);
	let basePelota_translation = vec3.fromValues(1000, 0, 0);
	transformations.push([vec3.fromValues(1, 1, 1), vec3.fromValues(0, 0, 0), basePelota_translation]);

	let pelota = new Model(pelotaRugby_source);
	pelota.generateModel(loc_pos);
	models.push(pelota);
	let pelota_translation = vec3.fromValues(1000, 1000, 0);
	transformations.push([vec3.fromValues(1, 1, 1), vec3.fromValues(0, 0, 0), pelota_translation]);

	let soportePelota = new Model(soportePelotaRugby_source);
	soportePelota.generateModel(loc_pos);
	models.push(soportePelota);
	let soportePelota_translation = vec3.fromValues(1000, 1000, 0);
	transformations.push([vec3.fromValues(1, 1, 1), vec3.fromValues(0, 0, 0), soportePelota_translation]);

	let marco = new Model(marcoCuadro_source);
	marco.generateModel(loc_pos);
	models.push(marco);
	let marco_translation = vec3.fromValues(0, 1000, -2500);
	transformations.push([vec3.fromValues(1, 1, 1), vec3.fromValues(0, 0, 0), marco_translation]);



	let suelo = new Model(suelo_source);
	suelo.generateModel(loc_pos);
	models.push(suelo);
	let suelo_translation = vec3.fromValues(0, 0, 0);
	transformations.push([vec3.fromValues(1, 1, 1), vec3.fromValues(0, 0, 0), suelo_translation]);

	let paredes = new Model(paredes_source);
	paredes.generateModel(loc_pos);
	models.push(paredes);
	let paredes_translation = vec3.fromValues(0, 0, 0);
	transformations.push([vec3.fromValues(1, 1, 1), vec3.fromValues(0, 0, 0), paredes_translation]);

	let techo = new Model(techo_source);
	techo.generateModel(loc_pos);
	models.push(techo);
	let techo_translation = vec3.fromValues(0, 0, 0);
	transformations.push([vec3.fromValues(1, 1, 1), vec3.fromValues(0, 0, 0), techo_translation]);

}

/**
 *	Aplica las transformaciones de modelado y posicionamiento en el mundo del modelo correspondiente al índice i.
 */
function applyTransformations(i) {
	let scaling = transformations[i][ESCALADO],
		rotation = transformations[i][ROTACION],
		translation = transformations[i][TRASLACION];

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
	let textLocation = gl.getAttribLocation(shader_program, 'vertexTex');
	let normLocation = gl.getAttribLocation(shader_program, 'normal');
	u_normalMatrix= gl.getUniformLocation(shader_program, 'normalMatrix');
	u_color_ka = gl.getUniformLocation(shader_program,'color_ka');
	u_color_kd = gl.getUniformLocation(shader_program,'color_kd');
	u_color_ks = gl.getUniformLocation(shader_program,'color_ks');
	u_CoefEsp = gl.getUniformLocation(shader_program,'CoefEsp');
	u_lightInt = gl.getUniformLocation(shader_program,'lightInt');
	u_lightEye = gl.getUniformLocation(shader_program,'lightEye');
	u_lightColorA = gl.getUniformLocation(shader_program,'lightColorA');
	u_lightColorD = gl.getUniformLocation(shader_program,'lightColorD');
	u_lightColorE = gl.getUniformLocation(shader_program,'lightColorE');
	u_enableA = gl.getUniformLocation(shader_program,'enableA');
	u_enableD = gl.getUniformLocation(shader_program,'enableD');
	u_enableE = gl.getUniformLocation(shader_program,'enableE');
	u_aAtt=gl.getUniformLocation(shader_program,'aAtt');
	u_bAtt=gl.getUniformLocation(shader_program,'bAtt');
	u_cAtt=gl.getUniformLocation(shader_program,'cAtt');
	u_sampler= gl.getUniformLocation(shader_program,'sampler');

	loadModels(loc_pos);

	for (let i = 0; i < models.length; i++) {
		applyTransformations(i);
	}

/*
	const CHAMPIONS = 0;
	const BASE_CHAMPIONS = 1;
	const STAND_CHAMPIONS = 2;
	const COPA_DESCARGADA = 3;
	const STAND_COPA_DESCARGADA = 4;
	const STAND_PELOTA = 5;
	const BASE_PELOTA = 6;
	const PELOTA = 7;
	const SOPORTE_PELOTA = 8;
	const MARCO_CUADRO = 9;
	const SUELO = 10;
	const PAREDES = 11;
	const TECHO = 12;
	*/
	let champions_color = Utils.hex2RgbFloat("#A9A9A9");
	let champions_base_color = Utils.hex2RgbFloat("#DCDCDC");
	let champions_stand_color = Utils.hex2RgbFloat("#8B4513");
	let copaDescargada_color = Utils.hex2RgbFloat("#000000");
	let copaDescargada_base_color = Utils.hex2RgbFloat("#DCDCDC");
	let copaDescargada_stand_color = Utils.hex2RgbFloat("#8B4513");
	let pelota_stand_color = Utils.hex2RgbFloat("#9400D3");
	let base_pelota_color = Utils.hex2RgbFloat("#9400D3");
	let soporte_pelota_color = Utils.hex2RgbFloat("#9400D3");
	let marco_color = Utils.hex2RgbFloat("#9400D3");
	let suelo_color = Utils.hex2RgbFloat("#9400D3");
	let paredes_color = Utils.hex2RgbFloat("#E75252");
	let techo_color = Utils.hex2RgbFloat("#DDDDDD");

	colors.push(vec3.fromValues(champions_color.r, champions_color.g, champions_color.b));
	colors.push(vec3.fromValues(champions_base_color.r, champions_base_color.g, champions_base_color.b));
	colors.push(vec3.fromValues(champions_stand_color.r, champions_stand_color.g, champions_stand_color.b));
	colors.push(vec3.fromValues(copaDescargada_color.r, copaDescargada_color.g, copaDescargada_color.b));
	colors.push(vec3.fromValues(copaDescargada_base_color.r, copaDescargada_base_color.g, copaDescargada_base_color.b));
	colors.push(vec3.fromValues(copaDescargada_stand_color.r, copaDescargada_stand_color.g, copaDescargada_stand_color.b));
	colors.push(vec3.fromValues(pelota_stand_color.r, pelota_stand_color.g, pelota_stand_color.b));
	colors.push(vec3.fromValues(base_pelota_color.r, base_pelota_color.g, base_pelota_color.b));
	colors.push(vec3.fromValues(soporte_pelota_color.r, soporte_pelota_color.g, soporte_pelota_color.b));
	colors.push(vec3.fromValues(marco_color.r, marco_color.g, marco_color.b));
	colors.push(vec3.fromValues(suelo_color.r, suelo_color.g, suelo_color.b));
	colors.push(vec3.fromValues(paredes_color.r, paredes_color.g, paredes_color.b));
	colors.push(vec3.fromValues(techo_color.r, techo_color.g, techo_color.b));

	gl.enable(gl.DEPTH_TEST);
	gl.clearColor(0.18, 0.18, 0.3, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	axis = new Axis();
	axis.load();

	// Crea las cámaras en base a las dimensiones del canvas.
	free_cam = new FreeCamera(55, canvas.clientWidth / canvas.clientHeight);
	spherical_cam = new SphericalCamera(55, canvas.clientWidth / canvas.clientHeight);
	camera = free_cam;

	if (isAnimated()) {
		request = requestAnimationFrame(onRender);
	} else {
		onRender();
	}
}

let angle = 0;

function onRender(now) {
	let view_mat = camera.view_mat,
		proj_mat = camera.proj_mat;

	var lightEye= [lightX,lightY,lightZ];	
	
	vec3.transformMat4(lightEye,lightEye,view_mat);

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	axis.render(proj_mat, view_mat);

	gl.useProgram(shader_program);
	gl.uniformMatrix4fv(loc_proj_mat, false, proj_mat);

	
	

	if (isAnimated()) {
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
        transformations[BASE_PELOTA][ROTACION][EJE_Y] += rotation_speed * delta_time;
        transformations[PELOTA][ROTACION][EJE_Y] += rotation_speed * delta_time;
        transformations[SOPORTE_PELOTA][ROTACION][EJE_Y] += rotation_speed * delta_time;
      }
      else {
        transformations[BASE_PELOTA][ROTACION][EJE_Y] -= rotation_speed * delta_time;
        transformations[PELOTA][ROTACION][EJE_Y] -= rotation_speed * delta_time;
        transformations[SOPORTE_PELOTA][ROTACION][EJE_Y] -= rotation_speed * delta_time;
      }
    }
	} else {
		then = -1;
	}

	for (let i = 0; i < models.length; i++) {
		applyTransformations(i);
		models[i].model_mat = model_mats[i];
		gl.uniform3fv(u_color_ka,color_ka);
		gl.uniform3fv(u_color_kd,color_kd);
		gl.uniform3fv(u_color_ks,color_ks);
		gl.uniform3fv(u_lightColorA,lightColorA);
		gl.uniform3fv(u_lightColorD,lightColorD);
		gl.uniform3fv(u_lightColorE,lightColorE);
		gl.uniform1f(u_CoefEsp,CoefEsp);
		gl.uniform1f(u_lightInt,lightInt);
		gl.uniform1f(u_enableA,enableA);
		gl.uniform1f(u_enableD,enableD);
		gl.uniform1f(u_enableE,enableE);
		gl.uniform3fv(u_lightEye,lightEye);
		gl.uniform1f(u_aAtt,aAtt);
		gl.uniform1f(u_bAtt,bAtt);
		gl.uniform1f(u_cAtt,cAtt);
		//gl.uniform3fv(loc_color, colors[i]);
		models[i].draw(is_solid);
	}

	if (isAnimated()) {
		request = requestAnimationFrame(onRender);
	} else {
		request = null;
	}
}
