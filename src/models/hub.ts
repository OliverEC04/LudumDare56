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
	assignedTermites: number;
	tunnels: Tunnel[];

	constructor(
		x: number,
		y: number,
		type: HubType,
		size: number,
		assignedTermites: number,
	) {
		this.x = x;
		this.y = y;
		this.type = type;
		this.size = size;
		this.assignedTermites = assignedTermites;
		this.tunnels = [];
	}

	public addTunnel(tunnel: Tunnel) {
		this.tunnels.push(tunnel);
	}
}
