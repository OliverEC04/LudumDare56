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
	tunnels: Tunnel[];

	constructor(
		x: number,
		y: number,
		type: NodeType,
		size: number,
		tunnels: Tunnel[],
	) {
		this.x = x;
		this.y = y;
		this.type = type;
		this.size = size;
		this.tunnels = tunnels;
	}
}