// Constantes.
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

// Variables Auxiliares para los shaders
var shader_phong, shader_luz, shader_phong_procedural, normalmap;

var textura_luna, textura_pelota, textura_pared;
// Tecturas para las esferas
var textura_metal, textura_height;
var textura_metalica, textura_oxido, textura_normales;
var textura_luna, textura_oxido;
var texturas_seleccionadas = [1.0,1.0,1.0,1.0];

//Aux variables
var coordenadas = new Array(16);
var len = coordenadas.length;
var camara;
var suelo;
var piso;
var champions;
var techo;
var champions_base;
var champions_stand;
var copaDescargada;
var standDescargada;
var standPelota;
var basePelota;
var pelota;
var soportePelota;
var marco;
var cam_seguridad;

// Esferas multitexturada , textura normal y procedural
var esfera_luna, esfera_metal;

//Esfera Mármol
var esfera_marmol;
var lacunaridad =3.0;
var ganancia = 0.45;
var octavas = 2;

// Variables Auxiliares para los objetos de luz
var luz_spot, luz_spot2, luz_spot3, luz_puntual, luz_direccional, luz_ambiente;
var luz_seleccionada = 0;
var esfera_puntual;
var cono_spot;
var flecha_direccional;
var pared;

//Musica
var musica_champions_league
var inicioRotacion;

var material_spot = {
	ka: [0,0,0],
	kd: [1,1,1],
	ks: [1,1,1],
	n: 10
};

var material_puntual = {
	ka: [0,0,0],
	kd: [1,1,1],
	ks: [1,1,1],
	n: 10
};

var material_direccional = {
	ka: [0,0,0],
	kd: [1,1,1],
	ks: [1,1,1],
	n: 10
};

var suelo_material = {
	ka: [0.23, 0.23, 0.23],
	kd: [0.28, 0.28, 0.28],
	ks: [0.77, 0.77, 0.77],
	n: 10
}

var champions_material = {
	ka: [0.023, 0.0, 0.00923],
	kd: [0.58, 0.0, 0.28],
	ks: [0.57, 0.5, 0.77],
	n: 10
}

var techo_material = {
	ka: [0.0, 0.0, 0.0],
	kd: [0.1, 0.1, 0.1],
	ks: [0.77, 0.47, 0.57],
	n:10
}

var bronce = {
	ka: [0.2125, 0.1275, 0.054],
	kd: [0.714, 0.4284, 0.18144],
	ks: [0.393548, 0.271906, 0.166721],
	n: 10
}

var camara_material = {
	ka: [0.5, 0, 0.2],
	kd: [0.714, 0.4284, 0.18144],
	ks: [0.393548, 0.271906, 0.166721],
	n: 10
}

var polished_silver = {
	ka: [0.23125, 0.23125, 0.23125],
	kd: [0.2775, 0.2775, 0.2775],
	ks: [0.773911, 0.773911, 0.773911],
	n: 10
}

var cyan_plastic = {
	ka: [0.0, 0.1, 0.06],
	kd: [0.01, 0.01, 0.01],
	ks: [0.50, 0.50, 0.50],
	n: 10
}

var champions_base_material = {
	ka: [0.003,0.2,0.02053],
	kd: [0.728, 0.428, 0.228],
	ks: [0.767, 0.757, 0.377],
	n: 10
}
var champions_stand_material = {
	ka: [0.10223, 0.023, 0.023],
	kd: [0.248, 0.28, 0.258],
	ks: [0.177, 0.77, 0.677],
	n: 10
}
var copaDescargada_material = {
	ka: [0.0623, 0.0723, 0.0273],
	kd: [0.128, 0.728, 0.728],
	ks: [0.277, 0.877, 0.9797],
	n: 10
}
var pelota_material = {
	ka: [0.2, 0.2, 0.2],
	kd: [0.328, 0.328, 0.0728],
	ks: [0.0677, 0.0377, 0.05477],
	n: 10
}
var copaDescargada_stand_material = {
	ka: [0.0123, 0.0253, 0.0323],
	kd: [0.128, 0.281, 0.228],
	ks: [0.277, 0.477, 0.577],
	n:10
}
var pelota_stand_material = {
	ka: [0.023, 0.023, 0.023],
	kd: [0.28, 0.28, 0.28],
	ks: [0.77, 0.77, 0.77],
	n: 10
}
var base_pelota_material = {
	ka: [0.053, 0.03, 0.1003],
	kd: [0.28, 0.28, 0.28],
	ks: [0.77, 0.77, 0.77],
	n: 10
}
var soporte_pelota_material = {
	ka: [1, 0.13, 0],
	kd: [0.28, 0.28, 0.28],
	ks: [0.77, 0.77, 0.77],
	n: 10
}
var marco_material = {
	ka: [0, 0, 0],
	kd: [0, 0, 0],
	ks: [0, 0, 0],
	n: 10
}

var paredes_material = {
	ka: [0.9, 0.23, 0.23],
	kd: [0.28, 0.28, 0.28],
	ks: [0.007, 0.0077, 0.077],
	n: 10
}


// Almacenamiento.
var vao_solid = null;
var vao_wire = null;

// Datos globales auxiliares.
var is_solid = false;
// var is_animated = false;
var rotar_champions = false;
var rotar_pelota = false;
var animacion_completa = false;
var horaria_champions =true;
var horaria_pelota =true;
var request = null;

// Parsed OBJ file
var parsed_model = null;

var axis;
var camera = null;
var free_cam = null;
var sherical_cam = null;
var camara_seguridad = null;

var tex;
var tex2;


// Tiempo del frame anterior.
var then = 0;

// Tiempo transcurrido.
var delta_time = 0;

// Velocidad de rotación.
var rotation_speed = 22;
var fps = 1/60;

/**
	* Verifica si se requiere una animación.
	*/
function isAnimated() {
	return (rotar_champions || rotar_pelota || animacion_completa);
}


function onLoad() {
	canvas = document.getElementById('canvas');
	gl = canvas.getContext('webgl2');

	// Shaders utilizados
	shader_phong = new Phong3(gl);
	shader_luz = new Shader_luz(gl);
	normalmap = new normalmap3(gl);
	shader_phong_procedural = new Phong3_Procedurales(gl);

	//Cargo los models para los distintos tipo de luces
	cono_spot = new Modelo(spot_obj,material_spot,shader_luz.loc_posicion,shader_luz.loc_normal,null);
	esfera_puntual = new Modelo(puntual_obj,material_puntual, shader_luz.loc_posicion,shader_luz.loc_normal,null);
	flecha_direccional = new Modelo(direccional_obj,material_direccional,shader_luz.loc_posicion,shader_luz.loc_normal,null);
	pared = new Modelo(paredes_source,10,shader_phong.loc_posicion,shader_phong.loc_normal,shader_phong.loc_textura);
	pared2 = new Modelo(paredes2_source,10,shader_phong.loc_posicion,shader_phong.loc_normal,shader_phong.loc_textura);
	piso = new Modelo(suelo_source,10, shader_phong_procedural.loc_posicion,shader_phong_procedural.loc_normal,shader_phong_procedural.loc_textura);
	champions = new Modelo(champions_source,polished_silver, shader_luz.loc_posicion,shader_luz.loc_normal,null);
	techo = new Modelo(techo_source,techo_material,shader_luz.loc_posicion,shader_luz.loc_normal,null);
	champions_base = new Modelo(base_giratoria_source,champions_base_material,shader_luz.loc_posicion,shader_luz.loc_normal,null);
	champions_stand = new Modelo(stand_giratorio_source,champions_stand_material,shader_luz.loc_posicion,shader_luz.loc_normal,null);
	copaDescargada = new Modelo(copaDescargada_source,copaDescargada_material,shader_luz.loc_posicion,shader_luz.loc_normal,null);
	standDescargada = new Modelo(standV2_source,copaDescargada_stand_material,shader_luz.loc_posicion,shader_luz.loc_normal,null);
	standPelota = new Modelo(standV2_source,copaDescargada_stand_material,shader_luz.loc_posicion,shader_luz.loc_normal,null);
	basePelota = new Modelo(base_giratoria_source,base_pelota_material,shader_luz.loc_posicion,shader_luz.loc_normal,null);
	pelota = new Modelo(pelotaRugby_source,10,shader_phong.loc_posicion,shader_phong.loc_normal,shader_phong.loc_textura);
	//pelota = new Modelo(pelotaRugby_source,10,shader_phong_procedural.loc_posicion,shader_phong_procedural.loc_normal, shader_phong_procedural.loc_textura);
	soportePelota = new Modelo(soportePelotaRugby_source,soporte_pelota_material,shader_luz.loc_posicion,shader_luz.loc_normal,null);
	marco = new Modelo(marcoCuadro_source,marco_material,shader_luz.loc_posicion,shader_luz.loc_normal,null);
	cam_seguridad = new Modelo(Camera_source,camara_material,shader_luz.loc_posicion,shader_luz.loc_normal,null);
	//champions = new Modelo(champions_source,polished_silver,shader_phong.loc_posicion,shader_phong.loc_normal,null);

	musica_champions_league = document.getElementById("musica_champions");


	gl.enable(gl.DEPTH_TEST);
	gl.clearColor(0.18, 0.18, 0.3, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	axis = new Axis();
	axis.load();

	// Crea las cámaras en base a las dimensiones del canvas.
	free_cam = new FreeCamera(80, canvas.clientWidth / canvas.clientHeight);
	spherical_cam = new SphericalCamera(80, canvas.clientWidth / canvas.clientHeight);
	camara_seguridad = new SphericalCamera(80, canvas.clientWidth / canvas.clientHeight);

	camera = free_cam;

	//INICIALIZAR LUCEEEEEEEEESSS (esta en el listener)
	inicializar_luces();

	//texturas
	textura_pelota = inicializar_textura("assets/pelota.jpg");
	textura_pared = inicializar_textura("assets/paredes.jpg")

	if (isAnimated()) {
		request = requestAnimationFrame(onRender);
	} else {
		onRender();
	}
}

var cambio = 1;
var cambio2 = 1;


function onRender(now) {

	//...................LUCES....................................................
	// 0 = spot, 1 = puntual, 2 = direccional
	gl.useProgram(shader_luz.shader_program);

	if (isAnimated()) {
		// Milisegundos a segundos.
		now *= 0.001;

		if (then == -1) {
			delta_time = 0;
			then = now;
			inicioRotacion = 0;
		} else {
			// Obtiene el tiempo transcurrido entre el último frame y el actual.
			delta_time = now - then;
			inicioRotacion += delta_time;
		}

		if (delta_time >= fps) {
			// limpiar canvas
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			// Almacena el tiempo actual para el próximo frame.
			then = now;
			delta_rad = glMatrix.toRadian(rotation_speed * delta_time);
	    if (rotar_champions) {
				delta_rad1 = delta_rad * ((horaria_champions)?(-1):(1));

				transformations[CHAMPIONS][ROTACION][EJE_Y] += delta_rad1;
				transformations[BASE_CHAMPIONS][ROTACION][EJE_Y] += delta_rad1;
	    }
	    if (rotar_pelota) {
				delta_rad2 = delta_rad * ((horaria_pelota)?(-1):(1));

				transformations[PELOTA][ROTACION][EJE_Y] += delta_rad2;
				transformations[SOPORTE_PELOTA][ROTACION][EJE_Y] += delta_rad2;
				transformations[BASE_PELOTA][ROTACION][EJE_Y] += delta_rad2;
	    }
	    // if (orbitando) {
			// 	if (orbitaChampions) {
	    //     transformations[CHAMPIONS][ORBITAR][2] -= rotation_speed * delta_time;
	    //   } else {
	    //     transformations[COPA_DESCARGADA][ORBITAR][2] -= rotation_speed * delta_time;
			// 	}
	    // }
		if(animacion_completa){

			if (cambio<465){
				luz_spot2.direccion[0] = (Math.cos(cambio++/16)-1)/2
				luz_spot2.direccion[2] = (Math.sin(cambio/16)-1)/2
			}
			else{
				luz_spot2.direccion[0] = -1
				luz_spot2.direccion[2] = -1
			}
			if (cambio<465){
				luz_spot3.direccion[0] = (Math.cos(cambio/16)+1)/2
				luz_spot3.direccion[2] = (Math.sin(-cambio/16)-1)/2
			}
			else{
				luz_spot3.direccion[0] = 1
				luz_spot3.direccion[2] = -1
			}
			if (inicioRotacion > 5){
				musica_champions_league.play();
				sleep(25000);
				
			}
		}
		
	}
	} else {
		// limpiar canvas
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		then = -1;
	}

	dibujar_luz(luz_spot,0,cono_spot);
	dibujar_luz(luz_spot2,3,cono_spot);
	dibujar_luz(luz_spot3,4,cono_spot);
	dibujar_luz(luz_puntual,1, esfera_puntual);
	dibujar_luz(luz_direccional,2,flecha_direccional);
	//dibujar_piso(shader_luz,piso)
	// dibujar_pared(shader_luz);
	dibujar_champions(shader_luz);
	dibujar_techo(shader_luz);
	dibujar_techo2(shader_luz);
	dibujar_champions_base(shader_luz);
	dibujar_champions_stand(shader_luz);
	dibujar_copaDescargada(shader_luz);
	dibujar_standDescargada(shader_luz);
	dibujar_standPelota(shader_luz);
	dibujar_basePelota(shader_luz);
	//dibujar_pelota(shader_luz);
	dibujar_soportePelota(shader_luz);
	dibujar_marco(shader_luz);
	dibujar_cam_seguridad (shader_luz);
	gl.useProgram(null);
//..................................................................................

	gl.useProgram(shader_phong.shader_program);

//.....................TEXTURA COMUN............................................
	//dibujar pelota
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, textura_pelota);
	gl.uniform1i(shader_phong.u_imagen , 0);


	dibujar_pelota(shader_phong);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, textura_pared);
	gl.uniform1i(shader_phong.u_imagen , 0);

	dibujar_pared(shader_phong);
	dibujar_pared2(shader_phong);
	dibujar_pared3(shader_phong);
	dibujar_pared4(shader_phong);

	gl.useProgram(null);

	gl.useProgram(shader_phong_procedural.shader_program);

	//.....................PROCEDURAL..........................................
	//anda joya
	gl.uniform1f(shader_phong_procedural.u_lacunaridad,lacunaridad);
	gl.uniform1f(shader_phong_procedural.u_ganancia,ganancia);
	gl.uniform1f(shader_phong_procedural.u_octavas,octavas);

	dibujar_piso(shader_phong_procedural,piso)

	gl.useProgram(null);


	if (isAnimated()) {
		request = requestAnimationFrame(onRender);
	} else {
		request = null;
	}
}

function dibujar_luz(luz, que_dibujar, objeto) {
	// si la luz es spot o puntual, tengo que mover el objeto según su posición
	let matriz = mat4.create();
	shader_luz.set_luz(luz_ambiente, luz_spot2, luz_spot3, luz_puntual, luz_direccional);
	if ( que_dibujar == 0 || que_dibujar == 1 || que_dibujar == 3 || que_dibujar == 4 ) {
		mat4.translate(matriz,matriz,luz.posicion);

		// escalar según el ángulo y rotar según la dirección
		if ( que_dibujar == 0 ) {
			rotar(luz.direccion, matriz);
			mat4.rotateX(matriz,matriz,3.14);
			mat4.translate(matriz,matriz,[0,50,0]);
			mat4.scale(matriz, matriz, [900,900,900]);
		}

		//PARA EL CASO ESPECIAL DEL SEGUNDO DRONE
		if ( que_dibujar == 3 ) {
			rotar(luz_spot2.direccion, matriz);
			mat4.rotateX(matriz,matriz,3.14);
			mat4.translate(matriz,matriz,[0,50,0]);
			mat4.scale(matriz, matriz, [300,300,300]);
		}

		//PARA EL CASO ESPECIAL DEL SEGUNDO DRONE
		if ( que_dibujar == 4 ) {
			rotar(luz_spot3.direccion, matriz);
			mat4.rotateX(matriz,matriz,3.14);
			mat4.translate(matriz,matriz,[0,50,0]);
			mat4.scale(matriz, matriz, [300,300,300]);
		}
	}
	else if ( que_dibujar == 2 ) rotar(luz_direccional.direccion, matriz);
	objeto.material.ka = luz.intensidad;
	objeto.matriz = matriz;
	dibujar(shader_luz,objeto);
}

var transformations = [];

const PARED = 0;
transformations[PARED]= [[1, 1, 1],[0, 0, 0],[-5000,0,-3750]];
function dibujar_pared(shader){
	matriz = mat4.create();
	translation = mat4.create();
	mat4.scale(matriz,matriz,transformations[PARED][ESCALADO]);
	mat4.fromTranslation(translation,transformations[PARED][TRASLACION]);
	mat4.mul(matriz, translation, matriz);
	pared.matriz = matriz;
	dibujar(shader, pared);
}

const CHAMPIONS = 1;
transformations[CHAMPIONS]= [[1, 1, 1],[glMatrix.toRadian(-90), glMatrix.toRadian(90), 0],[0,1010,0]];
function dibujar_champions(shader){
	let matriz = null;
	let x_rotation_mat = null;
	let y_rotation_mat = null;
  let rotation_mat = null;
	matriz = mat4.create();
	rotation_mat = mat4.create();
	x_rotation_mat = mat4.create();
	y_rotation_mat = mat4.create();
	translation = mat4.create();
	mat4.scale(matriz,matriz,transformations[CHAMPIONS][ESCALADO]);
	mat4.fromXRotation(x_rotation_mat, transformations[CHAMPIONS][ROTACION][0]);
	mat4.fromYRotation(y_rotation_mat, transformations[CHAMPIONS][ROTACION][1]);
	mat4.mul(rotation_mat, x_rotation_mat, rotation_mat);
	mat4.mul(rotation_mat, y_rotation_mat, rotation_mat);
	mat4.mul(matriz, rotation_mat, matriz);
	mat4.fromTranslation(translation,transformations[CHAMPIONS][TRASLACION]);
	mat4.mul(matriz, translation, matriz);
	champions.matriz = matriz;
	dibujar(shader, champions);

}

const BASE_CHAMPIONS = 2;
transformations[BASE_CHAMPIONS]= [[1, 1, 1],[0,0,0],[0, 0, 1]];
function dibujar_champions_base(shader){
	matriz = mat4.create();
	rotation_mat = mat4.create();
	x_rotation_mat = mat4.create();
	y_rotation_mat = mat4.create();
	translation = mat4.create();
	mat4.scale(matriz,matriz,transformations[BASE_CHAMPIONS][ESCALADO]);
	mat4.fromXRotation(x_rotation_mat, transformations[BASE_CHAMPIONS][ROTACION][0]);
	mat4.fromYRotation(y_rotation_mat, transformations[BASE_CHAMPIONS][ROTACION][1]);
	mat4.mul(rotation_mat, x_rotation_mat, rotation_mat);
	mat4.mul(rotation_mat, y_rotation_mat, rotation_mat);
	mat4.mul(matriz, rotation_mat, matriz);
	mat4.fromTranslation(translation,transformations[BASE_CHAMPIONS][TRASLACION]);
	mat4.mul(matriz, translation, matriz);
	champions_base.matriz = matriz;
	dibujar(shader, champions_base);
}

const CHAMPIONS_STAND = 3;
transformations[CHAMPIONS_STAND]= [[1, 1, 1],[0,0,0],[0, 0, 1]];
function dibujar_champions_stand(shader){
	matriz = mat4.create();
	translation = mat4.create();
	mat4.scale(matriz,matriz,transformations[CHAMPIONS_STAND][ESCALADO]);
	mat4.fromTranslation(translation,transformations[CHAMPIONS_STAND][TRASLACION]);
	mat4.mul(matriz, translation, matriz);
	champions_stand.matriz = matriz;
	dibujar(shader, champions_stand);
}

const COPA_DESCARGADA = 4;
transformations[COPA_DESCARGADA]= [[5, 5, 5],[0,0,0],[-1000, 1000, 0]];
function dibujar_copaDescargada(shader){
	matriz = mat4.create();
	translation = mat4.create();
	mat4.scale(matriz,matriz,transformations[COPA_DESCARGADA][ESCALADO]);
	mat4.fromTranslation(translation,transformations[COPA_DESCARGADA][TRASLACION]);
	mat4.mul(matriz, translation, matriz);
	copaDescargada.matriz = matriz;
	dibujar(shader, copaDescargada);
}

const STAND_DESCARGADA = 5;
transformations[STAND_DESCARGADA]= [[1, 1, 1],[0,0,0],[-1000, 0, 0]];
function dibujar_standDescargada(shader){
	matriz = mat4.create();
	translation = mat4.create();
	mat4.scale(matriz,matriz,transformations[STAND_DESCARGADA][ESCALADO]);
	mat4.fromTranslation(translation,transformations[STAND_DESCARGADA][TRASLACION]);
	mat4.mul(matriz, translation, matriz);
	standDescargada.matriz = matriz;
	dibujar(shader, standDescargada);
}

const STAND_PELOTA = 6;
transformations[STAND_PELOTA]= [[1, 1, 1],[0,0,0],[1000, 0, 0]];
function dibujar_standPelota(shader){
	matriz = mat4.create();
	translation = mat4.create();
	mat4.scale(matriz,matriz,transformations[STAND_PELOTA][ESCALADO]);
	mat4.fromTranslation(translation,transformations[STAND_PELOTA][TRASLACION]);
	mat4.mul(matriz, translation, matriz);
	standPelota.matriz = matriz;
	dibujar(shader, standPelota);
}

const BASE_PELOTA = 7;
transformations[BASE_PELOTA]= [[1, 1, 1],[0,0,0],[1000, 0, 0]];
function dibujar_basePelota(shader){
	matriz = mat4.create();
	rotation_mat = mat4.create();
	x_rotation_mat = mat4.create();
	y_rotation_mat = mat4.create();
	translation = mat4.create();
	mat4.scale(matriz,matriz,transformations[BASE_PELOTA][ESCALADO]);
	mat4.fromXRotation(x_rotation_mat, transformations[BASE_PELOTA][ROTACION][0]);
	mat4.fromYRotation(y_rotation_mat, transformations[BASE_PELOTA][ROTACION][1]);
	mat4.mul(rotation_mat, x_rotation_mat, rotation_mat);
	mat4.mul(rotation_mat, y_rotation_mat, rotation_mat);
	mat4.mul(matriz, rotation_mat, matriz);
	mat4.fromTranslation(translation,transformations[BASE_PELOTA][TRASLACION]);
	mat4.mul(matriz, translation, matriz);
	basePelota.matriz = matriz;
	dibujar(shader, basePelota);
}

const PELOTA = 8;
transformations[PELOTA]= [[1, 1, 1],[0,0,0],[1000, 1000, 0]];
function dibujar_pelota(shader){
	matriz = mat4.create();
	rotation_mat = mat4.create();
	x_rotation_mat = mat4.create();
	y_rotation_mat = mat4.create();
	translation = mat4.create();
	mat4.scale(matriz,matriz,transformations[PELOTA][ESCALADO]);
	mat4.fromXRotation(x_rotation_mat, transformations[PELOTA][ROTACION][0]);
	mat4.fromYRotation(y_rotation_mat, transformations[PELOTA][ROTACION][1]);
	mat4.mul(rotation_mat, x_rotation_mat, rotation_mat);
	mat4.mul(rotation_mat, y_rotation_mat, rotation_mat);
	mat4.mul(matriz, rotation_mat, matriz);
	mat4.fromTranslation(translation,transformations[PELOTA][TRASLACION]);
	mat4.mul(matriz, translation, matriz);
	pelota.matriz = matriz;
	dibujar(shader, pelota);
}

const SOPORTE_PELOTA = 8;
transformations[SOPORTE_PELOTA]= [[1, 1, 1],[0,0,0],[1000, 1000, 0]];
function dibujar_soportePelota(shader){
	matriz = mat4.create();
	rotation_mat = mat4.create();
	x_rotation_mat = mat4.create();
	y_rotation_mat = mat4.create();
	translation = mat4.create();
	mat4.scale(matriz,matriz,transformations[PELOTA][ESCALADO]);
	mat4.fromXRotation(x_rotation_mat, transformations[PELOTA][ROTACION][0]);
	mat4.fromYRotation(y_rotation_mat, transformations[PELOTA][ROTACION][1]);
	mat4.mul(rotation_mat, x_rotation_mat, rotation_mat);
	mat4.mul(rotation_mat, y_rotation_mat, rotation_mat);
	mat4.mul(matriz, rotation_mat, matriz);
	mat4.fromTranslation(translation,transformations[PELOTA][TRASLACION]);
	mat4.mul(matriz, translation, matriz);
	soportePelota.matriz = matriz;
	dibujar(shader, soportePelota);
}

const MARCO = 9;
transformations[MARCO]= [[1, 1, 1],[0,0,0],[0, 1000, -3750]];
function dibujar_marco(shader){
	matriz = mat4.create();
	translation = mat4.create();
	mat4.scale(matriz,matriz,transformations[MARCO][ESCALADO]);
	mat4.fromTranslation(translation,transformations[MARCO][TRASLACION]);
	mat4.mul(matriz, translation, matriz);
	marco.matriz = matriz;
	dibujar(shader, marco);
}

const TECHO = 10;
transformations[TECHO]= [[1, 1, 1.5],[0,0,0],[0, 0, 0]];
function dibujar_techo(shader){
	matriz = mat4.create();
	translation = mat4.create();
	mat4.scale(matriz,matriz,transformations[TECHO][ESCALADO]);
	mat4.fromTranslation(translation,transformations[TECHO][TRASLACION]);
	mat4.mul(matriz, translation, matriz);
	techo.matriz = matriz;
	dibujar(shader, techo);
}

const PISO = 11;
transformations[PISO]= [[1, 1, 1.5],[0,0,0],[0, 0, 0]];
function dibujar_piso(shader, piso){
	matriz = mat4.create();
	translation = mat4.create();
	mat4.scale(matriz,matriz,transformations[TECHO][ESCALADO]);
	mat4.fromTranslation(translation,transformations[TECHO][TRASLACION]);
	mat4.mul(matriz, translation, matriz);
	piso.matriz = matriz;
	dibujar(shader, piso);
}

const PARED2 = 12;
transformations[PARED2]= [[1, 1, 1],[0, glMatrix.toRadian(180), 0],[5000,0,3750]];
function dibujar_pared2(shader){
	matriz = mat4.create();
	translation = mat4.create();
	rotation_mat = mat4.create();
	y_rotation_mat = mat4.create();
	mat4.scale(matriz,matriz,transformations[PARED2][ESCALADO]);
	mat4.fromYRotation(y_rotation_mat, transformations[PARED2][ROTACION][1]);
	mat4.mul(rotation_mat, y_rotation_mat, rotation_mat);
	mat4.mul(matriz, rotation_mat, matriz);
	mat4.fromTranslation(translation,transformations[PARED2][TRASLACION]);
	mat4.mul(matriz, translation, matriz);
	pared.matriz = matriz;
	dibujar(shader, pared);
}

const PARED3 = 13;
transformations[PARED3]= [[1, 1, 1],[0, glMatrix.toRadian(-90), 0],[5000,0,-3750]];
function dibujar_pared3(shader){
	matriz = mat4.create();
	translation = mat4.create();
	rotation_mat = mat4.create();
	y_rotation_mat = mat4.create();
	mat4.scale(matriz,matriz,transformations[PARED3][ESCALADO]);
	mat4.fromYRotation(y_rotation_mat, transformations[PARED3][ROTACION][1]);
	mat4.mul(rotation_mat, y_rotation_mat, rotation_mat);
	mat4.mul(matriz, rotation_mat, matriz);
	mat4.fromTranslation(translation,transformations[PARED3][TRASLACION]);
	mat4.mul(matriz, translation, matriz);
	pared2.matriz = matriz;
	dibujar(shader, pared2);
}

const PARED4 = 14;
transformations[PARED4]= [[1, 1, 1],[0, glMatrix.toRadian(90), 0],[-5000,0,3750]];
function dibujar_pared4(shader){
	matriz = mat4.create();
	translation = mat4.create();
	rotation_mat = mat4.create();
	y_rotation_mat = mat4.create();
	mat4.scale(matriz,matriz,transformations[PARED4][ESCALADO]);
	mat4.fromYRotation(y_rotation_mat, transformations[PARED4][ROTACION][1]);
	mat4.mul(rotation_mat, y_rotation_mat, rotation_mat);
	mat4.mul(matriz, rotation_mat, matriz);
	mat4.fromTranslation(translation,transformations[PARED4][TRASLACION]);
	mat4.mul(matriz, translation, matriz);
	pared2.matriz = matriz;
	dibujar(shader, pared2);
}

const TECHO2 = 15;
transformations[TECHO2]= [[1, 1, 1.5],[0,glMatrix.toRadian(180),0],[0, 0, 0]];
function dibujar_techo2(shader){
	matriz = mat4.create();
	translation = mat4.create();
	rotation_mat = mat4.create();
	y_rotation_mat = mat4.create();
	mat4.scale(matriz,matriz,transformations[TECHO2][ESCALADO]);
	mat4.fromYRotation(y_rotation_mat, transformations[TECHO2][ROTACION][1]);
	mat4.mul(rotation_mat, y_rotation_mat, rotation_mat);
	mat4.mul(matriz, rotation_mat, matriz);
	mat4.fromTranslation(translation,transformations[TECHO2][TRASLACION]);
	mat4.mul(matriz, translation, matriz);
	techo.matriz = matriz;
	dibujar(shader, techo);
}

const CAM = 16;
transformations[CAM]= [[100, 100, 100],[0,0,0],[4300, 2900, -3150]];
function dibujar_cam_seguridad(shader){
	matriz = mat4.create();
	translation = mat4.create();
	mat4.scale(matriz,matriz,transformations[CAM][ESCALADO]);
	mat4.fromTranslation(translation,transformations[CAM][TRASLACION]);
	mat4.mul(matriz, translation, matriz);
	cam_seguridad.matriz = matriz;
	dibujar(shader, cam_seguridad);
}

function rotar(direccion, matriz) {
	let esferico = Utils.cartesianas_a_esfericas(direccion);
	// crea un cuaternión con las rotaciones de Phi y Theta de esferico
	let cuaternion_rotacion = quat.create();
	quat.rotateY(cuaternion_rotacion, cuaternion_rotacion, esferico[1]);
	quat.rotateX(cuaternion_rotacion, cuaternion_rotacion, esferico[2]);
	let rotacion = mat4.create();
	mat4.fromQuat(rotacion, cuaternion_rotacion);
	mat4.multiply(matriz, matriz, rotacion);
}

function dibujar(shader, objeto) {
	shader.set_luz(luz_ambiente, luz_spot2, luz_spot3, luz_puntual,luz_direccional);
	shader.set_material(objeto.material);

	// setea uniforms de matrices de modelo y normales
	let matriz_normal = mat4.create()
	gl.uniformMatrix4fv(shader.u_matriz_vista, false, camera.view_mat);
	gl.uniformMatrix4fv(shader.u_matriz_proyeccion, false, camera.proj_mat);
	mat4.multiply(matriz_normal,camera.view_mat,objeto.matriz);
	mat4.invert(matriz_normal,matriz_normal);
	mat4.transpose(matriz_normal,matriz_normal);
	gl.uniformMatrix4fv(shader.u_matriz_normal, false, matriz_normal);
	gl.uniformMatrix4fv(shader.u_matriz_modelo, false, objeto.matriz);

	if (!isAnimated() || delta_time >= fps) {
		gl.bindVertexArray(objeto.vao);
		gl.drawElements(gl.TRIANGLES, objeto.cant_indices, gl.UNSIGNED_INT, 0);
		gl.bindVertexArray(null);
	}
}

function handleLoadedTex(tex) {
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, tex);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tex.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.bindTexture(gl.TEXTURE_2D, null);
}


function inicializar_textura(imagen) {

	let textura = gl.createTexture();
	textura.image = new Image();
	textura.image.crossOrigin = "anonymous";
	textura.image.onload = function() { handleLoadedTex(textura); }
	textura.image.src = imagen;
	return textura;
}
