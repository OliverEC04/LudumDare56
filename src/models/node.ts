import {Tunnel} from './tunnel.ts';

export enum NodeType {
	none,
	food,
	mud,
	feces,
	home
}

export class Node {
	x: number;
	y: number;
	type: NodeType;
	size: number;
	assignedTermites: number;
	tunnels: Tunnel[];

	// visited: boolean;

	constructor(
		x: number,
		y: number,
		type: NodeType,
		size: number,
		assignedTermites: number,
		tunnels: Tunnel[],
	) {
		this.x = x;
		this.y = y;
		this.type = type;
		this.size = size;
		this.assignedTermites = assignedTermites;
		this.tunnels = tunnels;
		// this.visited = false;
	}
}