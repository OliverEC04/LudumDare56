import {Tunnel} from './tunnel.ts';

export enum HubType {
	none,
	food,
	mud,
	feces,
	home
}

export class Hub {
	x: number;
	y: number;
	type: HubType;
	size: number;
	tunnels: Tunnel[];
	bestVisit: Tunnel | null;

	constructor(
		x: number,
		y: number,
		type: HubType,
		size: number,
	) {
		this.x = x;
		this.y = y;
		this.type = type;
		this.size = size;
		this.tunnels = [];
		this.bestVisit = null;
	}

	public addTunnel(tunnel: Tunnel) {
		this.tunnels.push(tunnel);
	}
}
