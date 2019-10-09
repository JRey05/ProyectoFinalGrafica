/**
 * Helper class to parse OBJ files.
 * Based on: https://dannywoodz.wordpress.com/2014/12/16/webgl-from-scratch-loading-a-mesh/
 */
class OBJParser {
	/**
	 * Parse an OBJ file
	 * @param  {string} fileContent Full content of OBJ file
	 * @return {object}             Plain object containing arrays of indices, positions, normals, textures.
	 */
	static parseFile(fileContent) {
		let lines = fileContent.split('\n');
		let srcPositions = []; //[[x,y,z], [x,y,z], ...]
		let srcNormals = []; //[[x,y,z], [x,y,z], ...]
		let srcTextures = []; //[[u,v], [u,v], ...]
		let dstPositions = []; //[x,y,z,x,y,z, ...]
		let dstNormals = [];
		let dstTextures = [];
		let dstIndices = [];
		let map = {}; // 1/2/3 => 4
		let nextIndex = 0;
		// let v_x_min, v_x_max, v_y_min, v_y_max, v_z_min, v_z_max;
		let x_min, x_max, y_min, y_max, z_min, z_max;
		x_min = null;
		x_max = null;
		y_min = null;
		y_max = null;
		z_min = null;
		z_max = null;

		for (let i = 0; i < lines.length; i++) {
			let parts = lines[i].trim().split(' ');
			if (parts.length > 0) {
				switch (parts[0]) {
					case 'v':
						let x, y, z;
						x = parseFloat(parts[1]);
						y = parseFloat(parts[2]);
						z = parseFloat(parts[3]);
						if (x_min == null || x < x_min) {
							x_min = x;
							// v_x_min = vec3.fromValues(x_min, y, z);
						}
						if (x_max == null || x > x_max) {
							x_max = x;
							// v_x_max = vec3.fromValues(x_max, y, z);
						}
						if (y_min == null || y < y_min) {
							y_min = y;
							// v_y_min = vec3.fromValues(x, y_min, z);
						}
						if (y_max == null || y > y_max) {
							y_max = y;
							// v_y_max = vec3.fromValues(x, y_max, z);
						}
						if (z_min == null || z < z_min) {
							z_min = z;
							// v_z_min = vec3.fromValues(x, y, z_min);
						}
						if (z_max == null || z > z_max) {
							z_max = z;
							// v_z_max = vec3.fromValues(x, y, z_max);
						}
						srcPositions.push([parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3])]);
						break;
					case 'vn':
						srcNormals.push([parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3])]);
						break;
					case 'vt':
						srcTextures.push([parseFloat(parts[1]), parseFloat(parts[2])]);
						break;
					case 'f':
						for (let j = 0; j < 3; j++) {
							let f = parts[j + 1].split('/');
							if (f in map) {
								dstIndices.push(map[f]);
							} else {
								let position = srcPositions[parseInt(f[0]) - 1];
								dstPositions.push(position[0]);
								dstPositions.push(position[1]);
								dstPositions.push(position[2]);
								if (f[1]) { //If has textures
									let texture = srcTextures[parseInt(f[1]) - 1];
									dstTextures.push(texture[0]);
									dstTextures.push(texture[1]);
								}
								if (f[2]) { //If has normals
									let normal = srcNormals[parseInt(f[2]) - 1];
									dstNormals.push(normal[0]);
									dstNormals.push(normal[1]);
									dstNormals.push(normal[2]);
								}
								dstIndices.push(nextIndex);
								map[f] = nextIndex++;
							}
						}
						break;
				}
			}
		}
		// let min = [x_min, y_min, z_min];
		// let max = [x_max, y_max, z_max];
		let x_center = (x_min + x_max) / 2;
		let y_center = (y_min + y_max) / 2;
		let z_center = (z_min + z_max) / 2;
		let center = vec3.fromValues(x_center, y_center, z_center);
		// let up, right, forward;
		// up = vec3.create();
		// right = vec3.create();
		// forward = vec3.create();
		// vec3.sub(up, v_y_max, center);
		// vec3.normalize(up, up);
		// vec3.sub(right, v_x_max, center);
		// vec3.normalize(right, right);
		// vec3.sub(forward, v_z_max, center);
		// vec3.normalize(forward, forward);
		return {
			indices: dstIndices,
			positions: dstPositions,
			normals: dstNormals,
			textures: dstTextures,
			center: center,
			// up: up,
			// right: right,
			// forward: forward,
			// min: min,
			// max: max,
		};
	}
}