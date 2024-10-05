import {Tunnel, TunnelType} from '../models/tunnel.ts';
import {Hub, HubType} from '../models/hub.ts';

export class Game extends EventTarget {
	hubs: Hub[];
	tunnels: Tunnel[];
	home: Hub;
	termites: number;

	private readonly addedTunnel = new Event('addedTunnel');
	private readonly addedHub = new Event('addedHub');

	constructor() {
		super();
		this.hubs = [];
		this.tunnels = [];
		this.home = new Hub(0, 0, HubType.home, 0, 10);
		this.termites = 10;

		const home = this.addHub(0, 0, HubType.home, 10, 0);
		const food = this.addHub(1, 1, HubType.food, 10, 0);
		const none = this.addHub(0.25, 0.5, HubType.none, 0, 0);

		this.addTunnel(home, none, TunnelType.dug);
		this.addTunnel(none, food, TunnelType.dug);
	}

	public addTunnel(begin: Hub, end: Hub, type: TunnelType): Tunnel {
		const tunnel = new Tunnel(begin, end, type);
		this.tunnels.push(tunnel);

		super.dispatchEvent(this.addedTunnel);
		return tunnel;
	}

	public addHub(x: number, y: number, type: HubType, size: number, assignedTermites: number): Hub {
		const hub = new Hub(x, y, type, size, assignedTermites);
		this.hubs.push(hub);

		super.dispatchEvent(this.addedHub);
		return hub;
	}
}