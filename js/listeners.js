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
    if([32, 37, 38, 39, 40].indexOf(evt.keyCode) > -1) {
        evt.preventDefault();
				onKeyDown(evt);
    }
}, false);

function onKeyDown(evt) {
	switch(evt.code) {
		case "KeyW":
			camera.moveForward();
			break;
		case "KeyS":
			camera.moveBackward();
			break;
		case "KeyA":
			camera.moveLeft();
			break;
		case "KeyD":
			camera.moveRight();
			break;
		case "ArrowUp":
			camera.moveUp();
			break;
		case "ArrowDown":
			camera.moveDown();
			break;
		case "KeyJ":
			camera.yawLeft();
			break;
		case "KeyL":
			camera.yawRight();
			break;
		case "KeyI":
			camera.pitchUp();
			break;
		case "KeyK":
			camera.pitchDown();
			break;
		case "KeyU":
			camera.rollLeft();
			break;
		case "KeyO":
			camera.rollRight();
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
  if(document.pointerLockElement === canvas || document.mozPointerLockElement === canvas || document.webkitPointerLockElement) {
    document.addEventListener("mousemove", moveCallback, false);
  } else {
		document.removeEventListener("mousemove", moveCallback, false);
  }
}

function moveCallback(evt) {
	var delta_x = evt.movementX || evt.mozMovementX || evt.webkitMovementX || 0,
	delta_y = evt.movementY || evt.mozMovementY || evt.webkitMovementY || 0;

	if (delta_x != 0) {
		camera.yaw(-1 * delta_x/1000);
	}
	if (delta_y != 0) {
		camera.pitch(-1 * delta_y/1000);
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
  if(document.fullscreenElement === canvas || document.mozFullscreenElement === canvas || document.webkitFullscreenElement === canvas) {
		canvas.width = screen.width * devicePixelRatio;
		canvas.height = screen.height * devicePixelRatio;
  } else if (document.exitFullscreen) {
		// canvas.width = canvas.clientWidth * devicePixelRatio;
		// canvas.height = canvas.clientHeight * devicePixelRatio;
		canvas.width = 1024 * devicePixelRatio;
		canvas.height = 768 * devicePixelRatio;
  }
	gl.viewport(0, 0, canvas.width, canvas.height);
	mat4.perspective(camera.proj_mat, 45.0, canvas.width/canvas.height, 1.0, 4096.0);

	refresh();
}

function refresh() {
	if (!isAnimated) {
		onRender();
	}
}