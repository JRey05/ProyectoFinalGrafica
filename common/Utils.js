class Utils {
	static onFileChooser(event, onLoadFileHandler) {
		//Code from https://stackoverflow.com/questions/750032/reading-file-contents-on-the-client-side-in-javascript-in-various-browsers
		if (typeof window.FileReader !== 'function') {
			throw ("The file API isn't supported on this browser.");
		}
		let input = event.target;
		if (!input) {
			throw ("The browser does not properly implement the event object");
		}
		if (!input.files) {
			throw ("This browser does not support the 'files' property of the file input.");
		}
		if (!input.files[0]) {
			return undefined;
		}
		let file = input.files[0];
		let fileReader = new FileReader();
		fileReader.onload = onLoadFileHandler;
		fileReader.readAsText(file);
	}

	static rearrange2Lines(indices) {
		let result = [];
		let count = indices.length;
		for (let i = 0; i < count; i = i + 3) {
			result.push(indices[i]);
			result.push(indices[i + 1]);
			result.push(indices[i + 1]);
			result.push(indices[i + 2]);
			result.push(indices[i + 2]);
			result.push(indices[i]);
		}
		return result;
	}

	static hex2RgbInt(hex) {
		let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		};
	}

	static hex2RgbFloat(hex) {
		let rgbInt = Utils.hex2RgbInt(hex);
		return {
			r: parseFloat(rgbInt.r) / 255.0,
			g: parseFloat(rgbInt.g) / 255.0,
			b: parseFloat(rgbInt.b) / 255.0,
		};
	}

	static cartesianas_a_esfericas(cartesianas) {
		let x = cartesianas[0], y = cartesianas[1], z = cartesianas[2];
		let r,f,t;
		r = Math.sqrt(x*x + y*y + z*z);
		t = Math.atan2(x,z);
		if ( t < 0 ) t += 2*Math.PI;
		f = Math.acos(y/r);
		return [r,t,f];
	}

	static esfericas_a_cartesianas(esfericas) {
		let r = esfericas[0], t = esfericas[1], f = esfericas[2];
		let x,y,z;
		x = r * Math.sin(f) * Math.sin(t);
		y = r * Math.cos(f);
		z = r * Math.sin(f) * Math.cos(t);
		return [x,y,z];
	}
}