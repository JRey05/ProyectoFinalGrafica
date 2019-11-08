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
var shader_program2 = null;

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
var loc_model_mat;
var loc_view_mat;
var loc_world_mat;
var loc_proj_mat;
var loc_color;
var u_normalMatrix

var u_color_ka;
var u_color_kd;
var u_color_ks;
var u_CoefEsp;
var u_Tita;
var u_lightInt;
var u_lightEye;
var u_lightColor;
var u_spotLightColor;
var u_enabled;
var u_enabledSpot;
var u_aAtt;
var u_bAtt;
var u_cAtt;
var u_sampler;
var color_ka = [0.2,0.0,0.0];
var color_kd = [0.0,1.0,0.0];
var color_ks = [1.0,0.0,1.0];
var CoefEsp = 20;
var lightInt = 4.5;
var lightColorA= [0.5,0.2,0.2];
var lightColorD= [1.0,0.5,1.0];
var lightColorE= [0.2,0.2,0.2];
var enableA = 1.0;
var enableD = 1.0;
var enableE = 1.0;
var tex;
var tex2;

var u_spot_pos_E;
var spot_pos = [0.0, 100.0, 500.0];

// Arreglo de modelos.
var models = [];

// Arreglo de transformaciones. Cada elemento se corresponde con un modelo y almacena su escalado, rotación alrededor de sus ejes, traslación, y rotación con respecto a un punto; respectivamente.
// Las primeras tres transformaciones están representadas mediante vectores (vec3) mientras que la última está representada mediante una terna constituida por el punto
// alrededor del cual se rotará, el eje que define la rotación, y el ángulo de rotación; respectivamente.
var transformations = [];

// Arreglo de matrices de modelado. Cada elemento se corresponde con modelo y almacena la matriz que lo modela.
var model_mats = [];

// Arreglo de materiales. Cada elemento se corresponde con un modelo y almacena su material.
var materials = [];

// Tiempo del frame anterior.
var then = 0;

// Tiempo transcurrido.
var delta_time = 0;

// Velocidad de rotación.
var rotation_speed = 22;

// Arreglo con las luces.
var luces = [];

// Crear e inicializar luces.
var luz1 = {
	tipo:"puntual",
	posicion:[1000.0,3000.0,300.0],
	intencidad:4,
	color:[0.3,0.3,0.4],
	enabled:1.0,
	fAtt:[0.000002,0.0000002,0.0000005]	// [a,b,c]
}
var luz2 = {
	tipo:"spot",
	posicion:[0.0, 100.0, 500.0],
	color:[0.5,0.5,0.5],
	target:[0,0,0],
	tita:20/180,
	CoefEsp:0.0001,
	enabled:1.0
}

luces.push(luz1);
luces.push(luz2);

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
function loadModels(loc_pos, loc_norm, loc_text) {
	let champions = new Model(champions_source);
	champions.generateModel(loc_pos, loc_norm, loc_text);
	models.push(champions);
	let champions_translation = vec3.fromValues(0, 1010, 0);
	vec3.add(champions._center, champions._center, champions_translation);
	let champions_rotating = mat3.fromValues(-90,0,0);
	transformations.push([vec3.fromValues(1, 1, 1), champions_rotating, champions_translation]);

	let champions_base = new Model(base_giratoria_source);
	champions_base.generateModel(loc_pos, loc_norm, loc_text);
	models.push(champions_base);
	let champions_base_translation = vec3.fromValues(0, 0, 1);
	transformations.push([vec3.fromValues(1, 1, 1), vec3.fromValues(0, 0, 0), champions_base_translation]);

	let champions_stand = new Model(stand_giratorio_source);
	champions_stand.generateModel(loc_pos, loc_norm, loc_text);
	models.push(champions_stand);
	let champions_stand_translation = vec3.fromValues(0, 0, 1);
	vec3.add(champions_stand._center, champions_stand._center, champions_stand_translation);
	transformations.push([vec3.fromValues(1, 1, 1), vec3.fromValues(0, 0, 0), champions_stand_translation]);

	let copaDescargada = new Model(copaDescargada_source);
	copaDescargada.generateModel(loc_pos, loc_norm, loc_text);
	models.push(copaDescargada);
  let copaDescargada_scaling = mat3.fromValues(5,5,5);
  let copaDescargada_rotating = mat3.fromValues(0,0,0);
	let copaDescargada_translation = vec3.fromValues(-1000, 1000, 0);
	vec3.add(copaDescargada._center, copaDescargada._center, copaDescargada_translation);
	transformations.push([copaDescargada_scaling, copaDescargada_rotating, copaDescargada_translation]);

	let standDescargada = new Model(standV2_source);
	standDescargada.generateModel(loc_pos, loc_norm, loc_text);
	models.push(standDescargada);
	let standDescargada_translation = vec3.fromValues(-1000, 0, 0);
	transformations.push([vec3.fromValues(1, 1, 1), vec3.fromValues(0, 0, 0), standDescargada_translation]);

	let standPelota = new Model(standV2_source);
	standPelota.generateModel(loc_pos, loc_norm, loc_text);
	models.push(standPelota);
	let standPelota_translation = vec3.fromValues(1000, 0, 0);
	transformations.push([vec3.fromValues(1, 1, 1), vec3.fromValues(0, 0, 0), standPelota_translation]);

	let basePelota = new Model(base_giratoria_source);
	basePelota.generateModel(loc_pos, loc_norm, loc_text);
	models.push(basePelota);
	let basePelota_translation = vec3.fromValues(1000, 0, 0);
	transformations.push([vec3.fromValues(1, 1, 1), vec3.fromValues(0, 0, 0), basePelota_translation]);

	let pelota = new Model(pelotaRugby_source);
	pelota.generateModel(loc_pos, loc_norm, loc_text);
	models.push(pelota);
	let pelota_translation = vec3.fromValues(1000, 1000, 0);
	transformations.push([vec3.fromValues(1, 1, 1), vec3.fromValues(0, 0, 0), pelota_translation]);

	let soportePelota = new Model(soportePelotaRugby_source);
	soportePelota.generateModel(loc_pos, loc_norm, loc_text);
	models.push(soportePelota);
	let soportePelota_translation = vec3.fromValues(1000, 1000, 0);
	transformations.push([vec3.fromValues(1, 1, 1), vec3.fromValues(0, 0, 0), soportePelota_translation]);

	let marco = new Model(marcoCuadro_source);
	marco.generateModel(loc_pos, loc_norm, loc_text);
	models.push(marco);
	let marco_translation = vec3.fromValues(0, 1000, -2500);
	transformations.push([vec3.fromValues(1, 1, 1), vec3.fromValues(0, 0, 0), marco_translation]);

	let suelo = new Model(suelo_source);
	suelo.generateModel(loc_pos, loc_norm, loc_text);
	models.push(suelo);
	let suelo_translation = vec3.fromValues(0, 0, 0);
	transformations.push([vec3.fromValues(1, 1, 1), vec3.fromValues(0, 0, 0), suelo_translation]);

	let paredes = new Model(paredes_source);
	paredes.generateModel(loc_pos, loc_norm, loc_text);
	models.push(paredes);
	let paredes_translation = vec3.fromValues(0, 0, 0);
	transformations.push([vec3.fromValues(1, 1, 1), vec3.fromValues(0, 0, 0), paredes_translation]);

	let techo = new Model(techo_source);
	techo.generateModel(loc_pos, loc_norm, loc_text);
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
	loc_model_mat = gl.getUniformLocation(shader_program, 'model_mat');
	loc_view_mat = gl.getUniformLocation(shader_program, 'view_mat');
	loc_world_mat = gl.getUniformLocation(shader_program, 'world_mat');
	loc_proj_mat = gl.getUniformLocation(shader_program, 'proj_mat');
	let loc_text = gl.getAttribLocation(shader_program, 'vertexTex');
	let loc_norm = gl.getAttribLocation(shader_program, 'normal');
	u_normalMatrix= gl.getUniformLocation(shader_program, 'normalMatrix');
	u_color_ka = gl.getUniformLocation(shader_program,'color_ka');
	u_color_kd = gl.getUniformLocation(shader_program,'color_kd');
	u_color_ks = gl.getUniformLocation(shader_program,'color_ks');
	u_CoefEsp = gl.getUniformLocation(shader_program,'CoefEsp');
	u_Tita = gl.getUniformLocation(shader_program,'Tita');
	u_lightInt = gl.getUniformLocation(shader_program,'lightInt');
	u_lightEye = gl.getUniformLocation(shader_program,'lightEye');
	u_lightColor = gl.getUniformLocation(shader_program,'lightColor');
	u_spotLightColor = gl.getUniformLocation(shader_program,'spotLightColor');
	u_enabled = gl.getUniformLocation(shader_program,'enabled');
	u_enabledSpot = gl.getUniformLocation(shader_program,'enabledSpot');
	u_aAtt=gl.getUniformLocation(shader_program,'aAtt');
	u_bAtt=gl.getUniformLocation(shader_program,'bAtt');
	u_cAtt=gl.getUniformLocation(shader_program,'cAtt');
	u_spot_pos_E = gl.getUniformLocation(shader_program,'spot_pos_E');
	u_spot_tita = gl.getUniformLocation(shader_program,'spot_tita');
	u_sampler= gl.getUniformLocation(shader_program,'sampler');

	loadModels(loc_pos, loc_norm, loc_text);

	for (let i = 0; i < models.length; i++) {
		applyTransformations(i);
	}

	let bronce = {
		ka: [0.2125, 0.1275, 0.054],
		kd: [0.714, 0.4284, 0.18144],
		ks: [0.393548, 0.271906, 0.166721]
	}

	let polished_silver = {
		ka: [0.23125, 0.23125, 0.23125],
		kd: [0.2775, 0.2775, 0.2775],
		ks: [0.773911, 0.773911, 0.773911]
	}

	let cyan_plastic = {
		ka: [0.0, 0.1, 0.06],
		kd: [0.01, 0.01, 0.01],
		ks: [0.50, 0.50, 0.50]
	}

	let champions_material = {
		ka: [0.023, 0.0, 0.00923],
		kd: [0.58, 0.0, 0.28],
		ks: [0.57, 0.5, 0.77]
	}
	let champions_base_material = {
		ka: [0.003,0.2,0.02053],
		kd: [0.728, 0.428, 0.228],
		ks: [0.767, 0.757, 0.377]
	}
	let champions_stand_material = {
		ka: [0.10223, 0.023, 0.023],
		kd: [0.248, 0.28, 0.258],
		ks: [0.177, 0.77, 0.677]
	}
	let copaDescargada_material = {
		ka: [0.0623, 0.0723, 0.0273],
		kd: [0.128, 0.728, 0.728],
		ks: [0.277, 0.877, 0.9797]
	}
	let pelota_material = {
		ka: [0.2, 0.2, 0.2],
		kd: [0.328, 0.328, 0.0728],
		ks: [0.0677, 0.0377, 0.05477]
	}
	let copaDescargada_stand_material = {
		ka: [0.0123, 0.0253, 0.0323],
		kd: [0.128, 0.281, 0.228],
		ks: [0.277, 0.477, 0.577]
	}
	let pelota_stand_material = {
		ka: [0.023, 0.023, 0.023],
		kd: [0.28, 0.28, 0.28],
		ks: [0.77, 0.77, 0.77]
	}
	let base_pelota_material = {
		ka: [0.053, 0.03, 0.1003],
		kd: [0.28, 0.28, 0.28],
		ks: [0.77, 0.77, 0.77]
	}
	let soporte_pelota_material = {
		ka: [0.053, 0.013, 0.0723],
		kd: [0.28, 0.28, 0.28],
		ks: [0.77, 0.77, 0.77]
	}
	let marco_material = {
		ka: [0.23, 0.23, 0.23],
		kd: [0.28, 0.28, 0.28],
		ks: [0.77, 0.77, 0.77]
	}
	let suelo_material = {
		ka: [0.23, 0.23, 0.23],
		kd: [0.28, 0.28, 0.28],
		ks: [0.77, 0.77, 0.77]
	}
	let paredes_material = {
		ka: [0.6, 0.23, 0.23],
		kd: [0.28, 0.28, 0.28],
		ks: [0.007, 0.0077, 0.077]
	}
	let techo_material = {
		ka: [0.0, 0.0, 0.23],
		kd: [0.0, 0.0, 0.28],
		ks: [0.0, 0.0, 0.77]
	}

	materials.push(polished_silver);
	materials.push(champions_base_material);
	materials.push(cyan_plastic);
	materials.push(bronce);
	materials.push(copaDescargada_stand_material);
	materials.push(cyan_plastic);
	materials.push(base_pelota_material);
	materials.push(pelota_material);
	materials.push(soporte_pelota_material);
	materials.push(marco_material);
	materials.push(suelo_material);
	materials.push(paredes_material);
	materials.push(techo_material);

	gl.enable(gl.DEPTH_TEST);
	gl.clearColor(0.18, 0.18, 0.3, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	axis = new Axis();
	axis.load();

	// Crea las cámaras en base a las dimensiones del canvas.
	free_cam = new FreeCamera(55, canvas.clientWidth / canvas.clientHeight);
	spherical_cam = new SphericalCamera(55, canvas.clientWidth / canvas.clientHeight);
	camera = free_cam;

	initTex();
	if (isAnimated()) {
		request = requestAnimationFrame(onRender);
	} else {
		onRender();
	}
}

let angle = 0;

function onRender(now) {
	let M_mat = mat4.create();
	let view_mat = camera.view_mat,
		proj_mat = camera.proj_mat;

	let spot_pos_E = vec3.create();
	vec3.transformMat4(spot_pos_E, spot_pos, M_mat);
	vec3.transformMat4(spot_pos_E, spot_pos_E, view_mat);

	var lightEye= [luz1.posicion[0],luz1.posicion[1],luz1.posicion[2]];
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
		gl.uniform3fv(u_color_ka,materials[i].ka);
		gl.uniform3fv(u_color_kd,materials[i].kd);
		gl.uniform3fv(u_color_ks,materials[i].ks);
		gl.uniform3fv(u_lightColor,luz1.color);
		gl.uniform3fv(u_spotLightColor,luz2.color);
		gl.uniform1f(u_Tita,luz2.tita);
		gl.uniform1f(u_lightInt,luz1.intencidad);
		gl.uniform1f(u_enabled,luz1.enabled);
		gl.uniform1f(u_enabledSpot,luz2.enabled);
		gl.uniform3fv(u_lightEye,lightEye);
		gl.uniform1f(u_aAtt,luz1.fAtt[0]);
		gl.uniform1f(u_bAtt,luz1.fAtt[1]);
		gl.uniform1f(u_cAtt,luz1.fAtt[2]);
		gl.uniform3fv(u_spot_pos_E, spot_pos_E);
		//gl.uniform3fv(loc_color, colors[i]);
		gl.activeTexture(gl.TEXTURE0);
		gl.uniform1i(shader_program.samplerUniform,0);
		if (i == PELOTA) {
			gl.bindTexture(gl.TEXTURE_2D, tex);
			tex.image.src = "assets/pelota.jpg";
			// tex.image.src = "assets/chess.jpg";
			models[i].draw(is_solid, gl);
		} else {
			gl.bindTexture(gl.TEXTURE_2D, tex2);
			// tex2.image.src = "assets/steel.jpg";
			// tex2.image.src = "assets/chess.jpg";
			tex2.image.src = "";
			models[i].draw(is_solid, gl);
		}
	}

	if (isAnimated()) {
		request = requestAnimationFrame(onRender);
	} else {
		request = null;
	}
}

function initTex(){
	tex = gl.createTexture();
	tex2 = gl.createTexture();
	tex.image = new Image();
	tex.image.crossOrigin = "anonymous";
	tex.image.onload = function(){
		handleLoadedTex(tex);
	}
	tex2.image = new Image();
	tex2.image.crossOrigin = "anonymous";
	tex2.image.onload = function(){
		handleLoadedTex(tex2);
	}
}

function handleLoadedTex(tex){
	gl.bindTexture(gl.TEXTURE_2D, tex);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
	gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE, tex.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.bindTexture(gl.TEXTURE_2D, null);
}