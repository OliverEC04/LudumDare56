import {Hub} from './hub.ts';

export enum TunnelType {
	dug,
	mud,
	feces
}

export class Tunnel {
	begin: Hub;
	end: Hub;
	type: TunnelType;
	enabled: boolean;

	constructor(
		begin: Hub,
		end: Hub,
		type: TunnelType,
	) {
		this.begin = begin;
		this.end = end;
		this.type = type;
		this.enabled = true;
		this.begin.addTunnel(this);
		this.end.addTunnel(this);
	}
}
