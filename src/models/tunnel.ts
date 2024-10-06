import {Hub} from './hub.ts';

export enum TunnelType {
	dug = 1,
	mud = 2,
	feces = 4
}

export class Tunnel {
	private _begin: Hub;
	private _end: Hub;

	private _throughput: number;
	private _assignedTermites: number;
	private readonly _capacity: number;
	private readonly _type: TunnelType;
	private readonly _length: number;

	constructor(
		begin: Hub,
		end: Hub,
		type: TunnelType,
	) {
		this._begin = begin;
		this._end = end;
		this._length = Math.sqrt(Math.pow(this._begin.x - this._end.x, 2) + Math.pow(this._begin.y - this._end.y, 2));
		this._type = type;
		this._throughput = 0;
		this._assignedTermites = 0;
		this._capacity = this._length * this._type;

		this._begin.addTunnel(this);
		this._end.addTunnel(this);
	}

	get begin(): Hub {
		return this._begin;
	}

	get end(): Hub {
		return this._end;
	}


	get length(): number {
		return this._length;
	}

	get capacity(): number {
		return this._capacity;
	}

	get type(): TunnelType {
		return this._type;
	}

	get throughput(): number {
		return this._throughput;
	}

	set throughput(value: number) {
		this._throughput = value;
		this._assignedTermites = value * this._length;
	}

	get assignedTermites(): number {
		return this._assignedTermites;
	}

	public ensureBeginHub(hub: Hub){
		if (this._end == hub){
			this._end = this._begin;
			this._begin = hub;
		}
	}
}
