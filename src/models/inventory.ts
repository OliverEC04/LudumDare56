export class Inventory {
	constructor(food: number, mud: number, feces: number) {
		this._food = food;
		this._mud = mud;
		this._feces = feces;
	}

	private _food: number;

	get food() {
		return this._food;
	}

	set food(value) {
		this._food = value;
	}

	private _mud: number;

	get mud() {
		return this._mud;
	}

	set mud(value) {
		this._mud = value;
	}

	private _feces: number;

	get feces() {
		return this._feces;
	}

	set feces(value) {
		this._feces = value;
	}
}