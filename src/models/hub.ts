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
	tunnels: number[];

	// visited: boolean;

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
		// this.visited = false;
	}
}