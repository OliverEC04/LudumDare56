import {Tunnel, TunnelType} from '../models/tunnel.ts';
import {Hub, HubType} from '../models/hub.ts';

export enum Tool {
	None,
	DigTunnel,
	UpgradeTunnel,
}

export class Game extends EventTarget {
	hubs: Hub[];
	tunnels: Tunnel[];
	home: Hub;
	termites: number;
	selectedTool: Tool;

	constructor() {
		super();
		this.hubs = [];
		this.tunnels = [];
		this.home = new Hub(0, 0, HubType.home, 0, 10);
		this.termites = 10;
		this.selectedTool = Tool.None;

		const home = this.addHub(0, 0, HubType.home, 10, 0);
		const food = this.addHub(1, 1, HubType.food, 10, 0);
		const none = this.addHub(0.25, 0.5, HubType.none, 0, 0);

		this.addTunnel(home, none, TunnelType.dug);
		this.addTunnel(none, food, TunnelType.dug);

		requestAnimationFrame(this.onTick.bind(this));
	}

	private onTick(time: number){
		super.dispatchEvent(new CustomEvent("tick", {detail: {"time": time}}));
		requestAnimationFrame(this.onTick.bind(this));
	}

	public addTunnel(begin: Hub, end: Hub, type: TunnelType): Tunnel {
		const tunnel = new Tunnel(begin, end, type);
		this.tunnels.push(tunnel);

		super.dispatchEvent(new CustomEvent("addedTunnel", {detail: {"tunnel": tunnel, "allTunnels": this.tunnels}}));
		return tunnel;
	}

	public addHub(x: number, y: number, type: HubType, size: number, assignedTermites: number): Hub {
		const hub = new Hub(x, y, type, size, assignedTermites);
		this.hubs.push(hub);

		super.dispatchEvent(new CustomEvent("addedHub", {detail: {"hub": hub, "allHubs": this.hubs}}));
		return hub;
	}

	public selectTool(tool: Tool) {
		this.selectedTool = tool;
	}
}