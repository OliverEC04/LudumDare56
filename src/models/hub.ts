export enum HubType {
	none,
	food,
	mud,
	feces,
	home
}

export type Hub = {
	x: number,
	y: number,
	type: HubType,
	size: number,
	assignedTermites: number,
	tunnels: number[],
}

export function createHub(x: number, y: number, type: HubType, size: number, assignedTermites: number): Hub{
	return {
		x: x,
		y: y,
		type: type,
		size: size,
		assignedTermites: assignedTermites,
		tunnels: []
	};
}