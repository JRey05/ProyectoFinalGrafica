class VertexAttributeInfo {
	constructor(data, loc, size) {
		this._data = data;
		this._loc = loc;
		this._size = size;
	}

	get data() {
		return this._data;
	}

	get loc() {
		return this._loc;
	}

	get size() {
		return this._size;
	}
}