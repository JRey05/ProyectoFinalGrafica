function onSliderFovy(slider, labelId) {
	let fovy = parseFloat(slider.value);
	camera.fovy = fovy;
	writeValue(labelId, fovy);
	refresh();
}

function onDrone1BodyColor(picker) {
	let color = Utils.hex2RgbFloat(picker.value);
	colors[3] = vec3.fromValues(color.r, color.g, color.b);
	refresh();
}

function onDrone1RotorsColor(picker) {
	let color = Utils.hex2RgbFloat(picker.value);
	colors[4] = vec3.fromValues(color.r, color.g, color.b);
	refresh();
}

function toggleSolid() {
	is_solid = !is_solid;
	refresh();
}


function rotarTrofeo1() {
	inicioRotacion = 0;
	rotar_champions = !rotar_champions;
	if (isAnimated()) {
		window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.webkitRequestAnimationFrame;
		window.requestAnimationFrame(onRender);
	} else {
		onRender();
	}
}

function rotarTrofeo2() {
	rotar_pelota = !rotar_pelota;
	if (isAnimated()) {
		window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.webkitRequestAnimationFrame;
		window.requestAnimationFrame(onRender);
	} else {
		onRender();
	}
}

function horario1() {
	horaria_champions = !horaria_champions;
	/*
	if (rotar_champions) {
		window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.webkitRequestAnimationFrame;
		window.requestAnimationFrame(onRender);
	} else {
		onRender();
	}
	*/
}

function horario2() {
	horaria_pelota = !horaria_pelota;
	/*
	if (rotar_champions) {
		window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.webkitRequestAnimationFrame;
		window.requestAnimationFrame(onRender);
	} else {
		onRender();
	}
	*/
}

function orbita() {
	orbitando = !orbitando;
	if (isAnimated()) {
		window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.webkitRequestAnimationFrame;
		window.requestAnimationFrame(onRender);
	} else {
		onRender();
	}
}


function orbitaLaChampions() {
	orbitaChampions = !orbitaChampions;
	if (isAnimated()) {
		window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.webkitRequestAnimationFrame;
		window.requestAnimationFrame(onRender);
	} else {
		onRender();
	}
}



// function toggleAnimated() {
// 	is_animated = !is_animated;
// 	if (is_animated) {
// 		// Cross-platform.
// 		window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.webkitRequestAnimationFrame;
// 		window.requestAnimationFrame(onRender);
// 	} else {
// 		onRender();
// 	}
// }

function onSliderRotation(slider, labelId) {
	angle = parseFloat(slider.value);
	writeValue(labelId, angle);
	transformations[4][1][1] = angle;
	refresh();
}

function writeValue(labelId, value) {
	if (labelId) {
		document.getElementById(labelId).innerText = value;
	}
}

window.addEventListener("keydown", function(evt) {
	// space and arrow keys
	if ([32, 37, 38, 39, 40].indexOf(evt.keyCode) > -1) {
		evt.preventDefault();
		onKeyDown(evt);
	}
}, false);

let radius_step = 0.5;
function increaseRadius() {
	let radius = camera.getRadius();
	radius += radius_step;
	if (radius <= 10.0) {
		camera.setRadius(radius);
	}
}

let theta_step2 = 1.0;
function increaseTheta2() {
	let theta = cam_seguridad.getTheta();
	theta = (theta + theta_step2) % 360;
	cam_seguridad.setTheta(theta);
}

function decreaseRadius() {
	let radius = camera.getRadius();
	radius -= radius_step;
	if (radius >= 0.0) {
		camera.setRadius(radius);
	}
}

let theta_step = 1.0;
function increaseTheta() {
	let theta = camera.getTheta();
	theta = (theta + theta_step) % 360;
	camera.setTheta(theta);
}

function decreaseTheta() {
	let theta = camera.getTheta();
	theta = (theta - theta_step) % 360;
	camera.setTheta(theta);
}

let phi_step = 1.0;
function increasePhi() {
	let phi = camera.getPhi();
	phi += phi_step;
	if (phi <= 180) {
		camera.setPhi(phi);
	}
}

function decreasePhi() {
	let phi = camera.getPhi();
	phi -= phi_step;
	if (phi > 0) {
		camera.setPhi(phi);
	}
}

function onKeyDown(evt) {
	switch (evt.code) {
		case "KeyW":
			if (is_free) {
				camera.moveForward();
			}
			break;
		case "KeyS":
			if (is_free) {
				camera.moveBackward();
			}
			break;
		case "KeyA":
			if (is_free) {
				camera.moveLeft();
			}
			break;
		case "KeyD":
			if (is_free) {
				camera.moveRight();
			}
			break;
		case "ArrowUp":
			if (is_free) {
				camera.moveUp();
			}
			break;
		case "ArrowDown":
			if (is_free) {
				camera.moveDown();
			}
			break;
		case "KeyJ":
			if (is_free) {
				camera.yawLeft();
			}
			break;
		case "KeyL":
			if (is_free) {
				camera.yawRight();
			}
			break;
		case "KeyI":
			if (is_free) {
				camera.pitchUp();
			}
			break;
		case "KeyK":
			if (is_free) {
				camera.pitchDown();
			}
			break;
		case "KeyU":
			if (is_free) {
				camera.rollLeft();
			}
			break;
		case "KeyO":
			if (is_free) {
				camera.rollRight();
			}
			break;
		case "KeyF":
			// Cross-platform.
			canvas.requestFullscreen = canvas.requestFullscreen || canvas.mozRequestFullscreen || canvas.webkitRequestFullscreen;
			canvas.requestFullscreen();
			break;
		case "KeyM":
			// onCheckboxSolid();
			toggleSolid();
			break;
		// case "KeyP":
		// 	// onCheckboxAnimated();
		// 	toggleAnimated();
		// 	break;
		case "KeyY":
			if (is_spherical) {
				increasePhi();
			}
			break;
		case "KeyB":
			if (is_spherical) {
				decreasePhi();
			}
			break;
		case "KeyG":
			if (is_spherical) {
				decreaseTheta();
			}
			break;
		case "KeyH":
			if (is_spherical) {
				increaseTheta();
			}
			break;
		case "NumpadAdd":
			if (is_spherical) {
				increaseRadius();
			}
			break;
		case "NumpadSubtract":
			if (is_spherical) {
				decreaseRadius();
			}
			break;
		default:
			return;
	}
	refresh();
}

function onClick() {
	// Cross-platform.
	canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
	canvas.requestPointerLock();
}

document.addEventListener('pointerlockerror', lockError, false);
document.addEventListener('mozpointerlockerror', lockError, false);
document.addEventListener('webkitpointerlockerror', lockError, false);

function lockError() {
	alert("Pointer lock failed");
}

if ("onpointerlockchange" in document) {
	document.addEventListener('pointerlockchange', lockChangeAlert, false);
} else if ("onmozpointerlockchange" in document) {
	document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
} else if ("onwebkitpointerlockchange" in document) {
	document.addEventListener('webkitpointerlockchange', lockChangeAlert, false);
}

function lockChangeAlert() {
	if (document.pointerLockElement === canvas || document.mozPointerLockElement === canvas || document.webkitPointerLockElement) {
		document.addEventListener("mousemove", moveCallback, false);
	} else {
		document.removeEventListener("mousemove", moveCallback, false);
	}
}

function moveCallback(evt) {
	if (!is_free) {
		return;
	}

	var delta_x = evt.movementX || evt.mozMovementX || evt.webkitMovementX || 0,
		delta_y = evt.movementY || evt.mozMovementY || evt.webkitMovementY || 0;

	if (delta_x != 0) {
		camera.yaw(-1 * delta_x / 1000);
	}
	if (delta_y != 0) {
		camera.pitch(-1 * delta_y / 1000);
	}
	refresh();
}

if ("onfullscreenchange" in document) {
	document.addEventListener('fullscreenchange', toggleFullscreen, false);
} else if ("onmozfullscreenchange" in document) {
	document.addEventListener('mozfullscreenchange', toggleFullscreen, false);
} else if ("onwebkitfullscreenchange" in document) {
	document.addEventListener('webkitfullscreenchange', toggleFullscreen, false);
}

function toggleFullscreen() {
	let devicePixelRatio = window.devicePixelRatio || 1;
	if (document.fullscreenElement === canvas || document.mozFullscreenElement === canvas || document.webkitFullscreenElement === canvas) {
		canvas.width = screen.width * devicePixelRatio;
		canvas.height = screen.height * devicePixelRatio;
	} else if (document.exitFullscreen) {
		// canvas.width = canvas.clientWidth * devicePixelRatio;
		// canvas.height = canvas.clientHeight * devicePixelRatio;
		canvas.width = 1024 * devicePixelRatio;
		canvas.height = 768 * devicePixelRatio;
	}
	gl.viewport(0, 0, canvas.width, canvas.height);
	mat4.perspective(camera.proj_mat, 45.0, canvas.width / canvas.height, 1.0, 4096.0);

	refresh();
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

let automatica = false;
async function camaraAutomatica() {
	if (automatica) {
		return;
	}

	if (is_free) {
		is_free = false;
		is_spherical = true;
		camera = spherical_cam;
	}
	automatica = true;
	while (automatica) {
		increaseTheta();
		await sleep(15);
		refresh();
	}
}

let is_spherical = false;

function camaraEsferica() {
	if (!is_spherical) {
		camera = spherical_cam;
		is_spherical = true;
		is_free = false;
	}
	automatica = false;
	refresh();
}

let is_free = true;

function camaraLibre() {
	if (!is_free) {
		camera = free_cam;
		camera._eye = spherical_cam._eye;
		let forward = vec3.create();
		vec3.sub(forward, spherical_cam._target, spherical_cam._eye);
		vec3.normalize(camera._forward, forward);
		vec3.cross(camera._right, camera._forward, spherical_cam._up);
		is_free = true;
		is_spherical = false;
	}
	automatica = false;
	refresh();
}

function posicionx(id) { luces[0].posicion[0] = document.getElementById(id).value*1000; onRender() }

function posiciony(id) { luces[0].posicion[1] = document.getElementById(id).value*1000; onRender()}

function posicionz(id) { luces[0].posicion[2] = document.getElementById(id).value*1000; onRender()}

function angulo(id){
	let fc = document.getElementById(id).value;
	luces[1].tita = fc/180;
	onRender();
}



function refresh() {
	if (!isAnimated()) {
		onRender();
	}
}
var cambio = 1;
function toggleSpot1(){
	if (cambio == 1){
		cambio = 0;
		luz_spot2.intensidad = [0,0,0];
		onRender();
	}
	else if (cambio == 0){
		cambio = 1;
		luz_spot2.intensidad = [10,10,0];
		onRender();
	}
}

var cambio1 = 1;
function toggleSpot2(){
	if (cambio1 == 1){
		cambio1 = 0;
		luz_spot3.intensidad = [0,0,0];
		onRender();
	}
	else if (cambio1 == 0){
		cambio1 = 1;
		luz_spot3.intensidad = [15,0,15];
		onRender();
	}
}

function Animacion(){
	animacion_completa = !animacion_completa;
	if(animacion_completa == false){
		musica_champions_league.pause();
	}

	luz_spot2.intensidad = [10,10,0];
	luz_spot3.intensidad = [15,0,15];
	if (isAnimated()) {
		window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.webkitRequestAnimationFrame;
		window.requestAnimationFrame(onRender);
	} else {
		onRender();
	}
}

async function  Camara_seguridad(){
	console.log("que onda");
	camera = camara_seguridad;
	while (1) {
		increaseTheta();
		await sleep(15);
		refresh();
	}

}

function inicializar_luces() {
	luz_spot = new Light([0,4000,0],[0,-1,0],[0,0,0],10,[0,0,0]);
	luz_spot2 = new Light([1200,50,1200],[-1,1,-1],[0,0,0],10,[0,0,0]);
	luz_spot3 = new Light([-1200,50,1200],[1,1,-1],[0,0,0],10,[0,0,0]);
	luz_puntual = new Light([0,4500,0],null,[0.5,0.5,0.4],null,[0.1,0.12,0.5]);
	luz_direccional = new Light(null,[0,0,-1],[1.1,1.1,1.1],null,null);
	luz_ambiente = new Light(null,null,[1,1,1.5],null,null);

	atributos_spot = {
		eangulo: false,
		edir: false,
		epos: false,
		eatt: false
	};

	atributos_puntual = {
		eangulo: true,
		edir: true,
		epos: false,
		eatt: false
	};

	atributos_direccional = {
		eangulo: true,
		edir: false,
		epos: true,
		eatt: true
	};


	atributos_ambiente = {
		eangulo: true,
		edir: true,
		epos: true,
		eatt: true
	};

}
