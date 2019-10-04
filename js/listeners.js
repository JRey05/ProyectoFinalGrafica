function onSliderFovy(slider, labelId) {
	let fovy = parseFloat(slider.value);
	camera.fovy = fovy;
	writeValue(labelId, fovy);
	refresh();
}

function onTableColor(picker) {
	let color = Utils.hex2RgbFloat(picker.value);
	colors[0] = vec3.fromValues(color.r, color.g, color.b);
	// colors.set('table', vec3.fromValues(color.r, color.g, color.b)); FIXME Mapeo.
	refresh();
}

function onDrone1BodyColor(picker) {
	let color = Utils.hex2RgbFloat(picker.value);
	// colors[1] = vec3.fromValues(color.r, color.g, color.b);
	colors.set('drone1', vec3.fromValues(color.r, color.g, color.b));
	refresh();
}

function onDrone1RotorsColor(picker) {
	let color = Utils.hex2RgbFloat(picker.value);
	colors[2] = vec3.fromValues(color.r, color.g, color.b);
	// colors.set('rotors1', vec3.fromValues(color.r, color.g, color.b)); FIXME Mapeo.
	refresh();
}

function onDrone2BodyColor(picker) {
	let color = Utils.hex2RgbFloat(picker.value);
	colors[3] = vec3.fromValues(color.r, color.g, color.b);
	// colors.set('drone2', vec3.fromValues(color.r, color.g, color.b)); FIXME Mapeo.
	refresh();
}

function onDrone2RotorsColor(picker) {
	let color = Utils.hex2RgbFloat(picker.value);
	colors[4] = vec3.fromValues(color.r, color.g, color.b);
	// colors.set('rotors2', vec3.fromValues(color.r, color.g, color.b)); FIXME Mapeo.
	refresh();
}

// function onCheckboxSolid() {
// 	isSolid = !isSolid;
// 	refresh();
// }

function toggleSolid() {
	isSolid = !isSolid;
	refresh();
}

// function onCheckboxAnimated() {
// 	isAnimated = !isAnimated;
// 	if (isAnimated) {
// 		// Cross-platform.
// 		window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.webkitRequestAnimationFrame;
// 		window.requestAnimationFrame(onRender);
// 	} else {
// 		onRender();
// 	}
// }

function toggleAnimated() {
	isAnimated = !isAnimated;
	if (isAnimated) {
		// Cross-platform.
		window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.webkitRequestAnimationFrame;
		window.requestAnimationFrame(onRender);
	} else {
		onRender();
	}
}

function onSliderRotation(slider, labelId) {
	angle = parseFloat(slider.value);
	writeValue(labelId, angle);
	transformations[4][1][1] = angle;
	transformations[2][1][1] = angle;

	// FIXME Mapeo.
	// transformations.get('rotors1')[1][1] = angle;
	// transformations.get('rotors2')[1][1] = angle;
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

// Key Listeners
// *************
var radius_step = 1.0;
var theta_step = 1.0;
var phi_step = 1.0;

function increaseRadius() {
	let radius = camera.getRadius();
	radius = radius + radius_step;
	if (radius <= 10.0) {
		camera.setRadius(radius);

	}
}

function decreaseRadius() {
	let radius = camera.getRadius();
	radius = radius - radius_step;
	if (radius >= 0.0) {
		camera.setRadius(radius);

	}
}

function increaseTheta() {
	let theta = camera.getTheta();
	theta = theta + theta_step;
	//if (theta <= 360.0) {
	camera.setTheta(theta);
	//}
}

function decreaseTheta() {
	let theta = camera.getTheta();
	theta = theta - theta_step;
	//	if (theta >= 0.0) {
	camera.setTheta(theta);
	//}
}

function increasePhi() {
	let phi = camera.getPhi();
	phi = phi + phi_step;
	if (phi <= 359.0) {
		camera.setPhi(phi);
	}
}

function decreasePhi() {
	let phi = camera.getPhi();
	phi = phi - phi_step;
	if (phi >= 1.0) {
		camera.setPhi(phi);
	}
}

let is_free = false;
let is_spherical = true;
	function onKeyDown(evt) {
	switch (evt.code) {
		case "KeyW":
		if (is_free) {
				camera.moveForward();
			}
			break;
		case "KeyS":
			if (is_free){
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
		case "KeyP":
			// onCheckboxAnimated();
			toggleAnimated();
			break;
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
		await sleep(50);
		refresh();
	}
}

function camaraEsferica() {
	camera = spherical_cam;
	is_spherical = true;
	is_free = false;
	automatica = false;
	refresh();
}

function camaraLibre(){
	camera = free_cam;
	is_free = true;
	is_spherical = false;
	automatica = false;
	refresh();
}

function refresh() {
	if (!isAnimated) {
		onRender();
	}
}