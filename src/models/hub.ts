import {Tunnel} from './tunnel.ts';
import {TunnelQueue} from "./TunnelQueue.ts";

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
	bestVisit: TunnelQueue;

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
		this.assignedTermites = 0;
		this.tunnels = [];
		this.bestVisit = new TunnelQueue();
	}

	public addTunnel(tunnel: Tunnel) {
		this.tunnels.push(tunnel);
	}
}
