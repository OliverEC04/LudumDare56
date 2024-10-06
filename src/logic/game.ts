import {Tunnel, TunnelType} from '../models/tunnel.ts';
import {Hub, HubType} from '../models/hub.ts';
import {TunnelQueue} from "../models/TunnelQueue.ts";

export enum Tool {
	None,
	DigTunnel,
	UpgradeTunnel,
}

export class Game extends EventTarget {
	hubs: Hub[];
	tunnels: Tunnel[];
	home: Hub;
	assignedTermites: number;
	termiteCount: number;
	selectedTool: Tool;
	readonly searchQueue: TunnelQueue;

	constructor() {
		super();
		this.hubs = [];
		this.tunnels = [];
		this.assignedTermites = 0;
		this.termiteCount = 10;
		this.selectedTool = Tool.None;

		this.home = this.addHub(0, 0, HubType.home, 10);
		const food = this.addHub(1, 1, HubType.food, 10);
		const none = this.addHub(0.25, 0.5, HubType.none, 0);

		this.addTunnel(this.home, none, TunnelType.dug);
		this.addTunnel(none, food, TunnelType.dug);

		requestAnimationFrame(this.onTick.bind(this));

		this.searchQueue = new TunnelQueue();
		this.resetSearch();

		setTimeout(this.resetSearch.bind(this), 10000);
	}

	public assignMissingTermites(){
		if (this.searchQueue.length === 0){
			return;
		}

		if (this.assignedTermites >= this.termiteCount){
			return;
		}

		const nextTunnel = this.searchQueue.peekTunnel();
		const nextHub = nextTunnel.end;
		if (nextHub.type === HubType.food || nextHub.type === HubType.mud || nextHub.type === HubType.feces){
			const result = this.tryAssignTermites(this.termiteCount - this.assignedTermites, nextTunnel);

			if (result){
				const unusedThroughput = (this.termiteCount - this.assignedTermites) / result.length;
				const usedThroughput = Math.min(unusedThroughput, result.minThroughput);
				this.placeTermites(usedThroughput, nextTunnel)
				this.assignedTermites += usedThroughput * result.length;
			}
		}

		if (this.assignedTermites >= this.termiteCount){
			return;
		}

		const length = this.searchQueue.peekLength();
		this.searchQueue.dequeue();
		const firstVisit = nextHub.bestVisit.length === 0;
		nextHub.bestVisit.enqueue(length, nextTunnel);
		if (firstVisit){
			this.queueTunnels(nextTunnel.end, length);
		}
		this.assignMissingTermites();
	}

	private tryAssignTermites(newTermiteCount: number, endTunnel: Tunnel): { length: number, minThroughput: number } | null {
		const hub = endTunnel.begin;

		// Verify this tunnel.
		const tunnelMissingCapacity = endTunnel.capacity - endTunnel.assignedTermites;
		newTermiteCount = Math.min(newTermiteCount, tunnelMissingCapacity);
		if (newTermiteCount <= 0){
			return null;
		}

		if (hub.type === HubType.home){
			return { length: endTunnel.length, minThroughput: endTunnel.throughput };
		}

		while (hub.bestVisit.length > 0){
			const nextTunnel = hub.bestVisit.peekTunnel();
			const result = this.tryAssignTermites(newTermiteCount, nextTunnel)
			if (result){
				return {length: result.length + endTunnel.length, minThroughput: Math.min(result.minThroughput, endTunnel.throughput) };
			}
			// Route doesn't work, try the next route.
			hub.bestVisit.dequeue();
		}
		return null;
	}

	private placeTermites(throughput: number, tunnel: Tunnel){
		// TODO: Maybe move the while loop from TryAssignTermites down here. Removing objects here if their throughput is full. Then we dont need the logic to check for full throughput's in the other function.
		tunnel.throughput += throughput;
		const hub = tunnel.begin;
		if (hub.type === HubType.home){
			return;
		}
		this.placeTermites(throughput, hub.bestVisit.peekTunnel());
	}

	private queueTunnels(hub: Hub, accLength: number){
		for (const tunnel of hub.tunnels) {
			tunnel.ensureBeginHub(hub);
			this.searchQueue.enqueue(accLength + tunnel.length, tunnel);
		}
	}

	public resetSearch(){
		for (const hub of this.hubs) {
			hub.assignedTermites = 0;
			hub.bestVisit.clear();
		}
		for (const tunnel of this.tunnels) {
			tunnel.throughput = 0;
		}
		this.assignedTermites = 0;
		this.searchQueue.clear();
		this.queueTunnels(this.home, 0);
		this.assignMissingTermites();
	}

	private onTick(time: number){
		super.dispatchEvent(new CustomEvent("tick", {detail: {"time": time}}));
		requestAnimationFrame(this.onTick.bind(this));
	}

	public addTunnel(begin: Hub, end: Hub, type: TunnelType): Tunnel | null {
		if (begin == end){
			return null;
		}
		const tunnel = new Tunnel(begin, end, type);
		this.tunnels.push(tunnel);

		super.dispatchEvent(new CustomEvent("addedTunnel", {detail: {"tunnel": tunnel, "allTunnels": this.tunnels}}));
		return tunnel;
	}

	public addHub(x: number, y: number, type: HubType, size: number): Hub {
		const hub = new Hub(x, y, type, size);
		this.hubs.push(hub);

		super.dispatchEvent(new CustomEvent("addedHub", {detail: {"hub": hub, "allHubs": this.hubs}}));
		return hub;
	}

	public selectTool(tool: Tool) {
		this.selectedTool = tool;
	}
}