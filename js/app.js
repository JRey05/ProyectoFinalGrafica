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

// Variables Auxiliares para los shaders
var shader_phong, shader_luz, shader_phong_procedural, normalmap;

var textura_luna, textura_suelo;
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

// Esferas multitexturada , textura normal y procedural
var esfera_luna, esfera_metal;

//Esfera Mármol
var esfera_marmol;
var lacunaridad =2.0;
var ganancia = 0.45;
var octavas = 8;

// Variables Auxiliares para los objetos de luz
var luz_spot, luz_spot2, luz_spot3, luz_puntual, luz_direccional, luz_ambiente;
var luz_seleccionada = 0;
var esfera_puntual;
var cono_spot;
var flecha_direccional;
var pared;

//Musica
var musica_champions_league

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
	ka: [0.0, 0.0, 0.23],
	kd: [0.0, 0.0, 0.28],
	ks: [0.0, 0.0, 0.77],
	n: 10
}

var bronce = {
	ka: [0.2125, 0.1275, 0.054],
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

var tex;
var tex2;


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
	if(rotar1 || rotar2) console.log("DEBEMOS HACER ALGO PARA HACERLO ROTAR");
	return (rotar1 || rotar2);
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
	pared = new Modelo(paredes_source,paredes_material,shader_luz.loc_posicion,shader_luz.loc_normal,null);
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
	camera = free_cam;

	//TEXTURAAAAAAAAAAASSSSS
	initTex();

	//INICIALIZAR LUCEEEEEEEEESSS (esta en el listener)
	inicializar_luces();

	//textura_suelo = inicializar_textura("assets/pelota.jpg");

	
	if (isAnimated()) {
		request = requestAnimationFrame(onRender);
	} else {
		onRender();
	}
}



function onRender(now) {
	
	// limpiar canvas
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	musica_champions_league.play();
	//...................LUCES....................................................
	// 0 = spot, 1 = puntual, 2 = direccional
	gl.useProgram(shader_luz.shader_program);
	dibujar_luz(luz_spot,0,cono_spot);
	dibujar_luz(luz_spot2,3,cono_spot);
	dibujar_luz(luz_spot3,0,cono_spot);
	dibujar_luz(luz_puntual,1, esfera_puntual);
	dibujar_luz(luz_direccional,2,flecha_direccional);
	//dibujar_piso(shader_luz,piso)
	dibujar_pared(shader_luz);
	dibujar_champions(shader_luz);
	dibujar_techo(shader_luz);
	dibujar_champions_base(shader_luz);
	dibujar_champions_stand(shader_luz);
	dibujar_copaDescargada(shader_luz);
	dibujar_standDescargada(shader_luz);
	dibujar_standPelota(shader_luz);
	dibujar_basePelota(shader_luz);
	//dibujar_pelota(shader_luz);
	dibujar_soportePelota(shader_luz);
	dibujar_marco(shader_luz);
	gl.useProgram(null);
//..................................................................................

	gl.useProgram(shader_phong.shader_program);

//.....................TEXTURA COMUN............................................
	//dibujar pelota
	//tex = inicializar_textura("assets/pelota.jpg");
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, tex);
	gl.uniform1i(shader_phong.u_imagen , 0);
	
	
	dibujar_pelota(shader_phong);
	
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
	shader_luz.set_luz(luz_ambiente, luz_spot, luz_spot2, luz_puntual, luz_direccional);
	if ( que_dibujar == 0 || que_dibujar == 1 || que_dibujar == 3 ) {
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
	}
	else if ( que_dibujar == 2 ) rotar(luz_direccional.direccion, matriz);
	objeto.material.ka = luz.intensidad;
	objeto.matriz = matriz;
	dibujar(shader_luz,objeto);
}

function dibujar_pared(shader){
	let matriz;
	matriz = mat4.create();
	mat4.translate(matriz,matriz,[0,0,0]);
	mat4.scale(matriz,matriz,[1,1,1]);
	pared.matriz = matriz;
	dibujar(shader, pared);
}

function dibujar_champions(shader){
	let matriz;
	let z_rotation_mat = null;
    let rotation_mat = null;
	matriz = mat4.create();
	z_rotation_mat = mat4.create();
	rotation_mat = mat4.create();
	mat4.translate(matriz,matriz,[0,1010,0]);
	mat4.scale(matriz,matriz,[1,1,1]);
	mat4.rotateX(matriz,matriz,-3.14/2);
	mat4.fromYRotation(z_rotation_mat, glMatrix.toRadian(90));
	mat4.mul(rotation_mat, z_rotation_mat, rotation_mat);
	mat4.mul(matriz, rotation_mat, matriz);
	champions.matriz = matriz;
	dibujar(shader, champions);

}

function dibujar_champions_base(shader){
	let matriz;
	matriz = mat4.create();
	mat4.translate(matriz,matriz,[0,0,1]);
	mat4.scale(matriz,matriz,[1,1,1]);
	champions_base.matriz = matriz;
	dibujar(shader, champions_base);
}

function dibujar_champions_stand(shader){
	let matriz;
	matriz = mat4.create();
	mat4.translate(matriz,matriz,[0,0,1]);
	mat4.scale(matriz,matriz,[1,1,1]);
	champions_stand.matriz = matriz;
	dibujar(shader, champions_stand);
}

function dibujar_copaDescargada(shader){
	let matriz;
	matriz = mat4.create();
	mat4.translate(matriz,matriz,[-1000,1000,0]);
	mat4.scale(matriz,matriz,[5,5,5]);
	copaDescargada.matriz = matriz;
	dibujar(shader, copaDescargada);
}

function dibujar_standDescargada(shader){
	let matriz;
	matriz = mat4.create();
	mat4.translate(matriz,matriz,[-1000,0,0]);
	mat4.scale(matriz,matriz,[1,1,1]);
	standDescargada.matriz = matriz;
	dibujar(shader, standDescargada);
}

function dibujar_standPelota(shader){
	let matriz;
	matriz = mat4.create();
	mat4.translate(matriz,matriz,[1000,0,0]);
	mat4.scale(matriz,matriz,[1,1,1]);
	standPelota.matriz = matriz;
	dibujar(shader, standPelota);
}

function dibujar_basePelota(shader){
	let matriz;
	matriz = mat4.create();
	mat4.translate(matriz,matriz,[1000,0,0]);
	mat4.scale(matriz,matriz,[1,1,1]);
	basePelota.matriz = matriz;
	dibujar(shader, basePelota);
}

function dibujar_pelota(shader){
	let matriz;
	matriz = mat4.create();
	mat4.translate(matriz,matriz,[1000,1000,0]);
	mat4.scale(matriz,matriz,[1,1,1]);
	pelota.matriz = matriz;
	dibujar(shader, pelota);
}

function dibujar_soportePelota(shader){
	let matriz;
	matriz = mat4.create();
	mat4.translate(matriz,matriz,[1000,1000,0]);
	mat4.scale(matriz,matriz,[1,1,1]);
	soportePelota.matriz = matriz;
	dibujar(shader, soportePelota);
}

function dibujar_marco(shader){
	let matriz;
	matriz = mat4.create();
	mat4.translate(matriz,matriz,[0,1000, -2500]);
	mat4.scale(matriz,matriz,[1,1,1]);
	marco.matriz = matriz;
	dibujar(shader, marco);
}

function dibujar_techo(shader){
	let matriz;
	matriz = mat4.create();
	mat4.translate(matriz,matriz,[0,0,0]);
	mat4.scale(matriz,matriz,[1,1,1]);
	techo.matriz = matriz;
	dibujar(shader, techo);
}

function dibujar_piso(shader, piso){
	let matriz;
	matriz = mat4.create();
	mat4.translate(matriz,matriz,[0,0,0]);
	mat4.scale(matriz,matriz,[1,1,1]);
	piso.matriz = matriz;
	dibujar(shader, piso);
}

function rotar(direccion, matriz) {
	let matriz_rotation = mat4.create();
	let matriz_rotationy = mat4.create();

	let esferico = Utils.cartesianas_a_esfericas(direccion);
//	// crea un cuaternión con las rotaciones de f y t de esferico
	let cuaternion_rotacion = quat.create();
	quat.rotateY(cuaternion_rotacion, cuaternion_rotacion, esferico[1]);
	quat.rotateX(cuaternion_rotacion, cuaternion_rotacion, esferico[2]);
	let rotacion = mat4.create();
	mat4.fromQuat(rotacion, cuaternion_rotacion);
	mat4.multiply(matriz, matriz, rotacion);
}

function dibujar(shader, objeto) {
	shader.set_luz(luz_ambiente,luz_spot, luz_spot2, luz_puntual,luz_direccional);
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
	
	gl.bindVertexArray(objeto.vao);
	gl.drawElements(gl.TRIANGLES, objeto.cant_indices, gl.UNSIGNED_INT, 0);
	gl.bindVertexArray(null);
}

function initTex(){
	tex = gl.createTexture();
	tex.image = new Image();
	console.log(tex.image);
	tex.image.crossOrigin = "anonymous";
	tex.image.onload = function(){
		handleLoadedTex(tex);
	}
	tex.image.src = "assets/32.jpg";
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