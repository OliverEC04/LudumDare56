import {Tunnel, TunnelType} from '../models/tunnel.ts';
import {Hub, HubType} from '../models/hub.ts';
import {TunnelQueue} from '../models/TunnelQueue.ts';
import {Inventory} from '../models/inventory.ts';

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
	scoutRatio: number;
	foragerRatio: number;
	tunnelerRatio: number;
	assignedTermiteMap: Map<HubType, number> = new Map<HubType, number>();
	selectedTool: Tool;
	readonly inventory: Inventory;
	readonly searchQueue: TunnelQueue;

	constructor() {
		super();
		this.hubs = [];
		this.tunnels = [];
		this.assignedTermites = 0;
		this.termiteCount = 10;
		this.scoutRatio = 1 / 3;
		this.foragerRatio = 1 / 3;
		this.tunnelerRatio = 1 / 3;
		this.selectedTool = Tool.None;
		this.inventory = new Inventory(0, 0, 0);

		this.home = this.addHub(0, 0, HubType.home, 10);

		requestAnimationFrame(this.onTick.bind(this));

		this.searchQueue = new TunnelQueue();

		setTimeout(this.resetSearch.bind(this), 10000);
	}

	public assignMissingTermites() {
		if (this.searchQueue.length === 0) {
			return;
		}

		if (this.assignedTermites >= this.termiteCount) {
			console.log(this);
			return;
		}

		const nextTunnel = this.searchQueue.peekTunnel();
		const nextHub = nextTunnel.end;
		if (nextHub.type === HubType.food || nextHub.type === HubType.mud || nextHub.type === HubType.feces) {
			const result = this.estimateRoute(nextTunnel);

			if (result) {
				const unusedThroughput = (this.termiteCount - this.assignedTermites) / result.length;
				const usedThroughput = Math.min(unusedThroughput, result.minThroughput);
				this.placeTermites(usedThroughput, nextTunnel);
				const termites = usedThroughput * result.length;
				this.assignedTermites += termites;

				const existingTermites = this.assignedTermiteMap.get(nextHub.type);
				if (!existingTermites) {
					throw Error('How did we end up here?');
				}
				this.assignedTermiteMap.set(nextHub.type, existingTermites + termites);
			}
		}

		if (this.assignedTermites >= this.termiteCount) {
			return;
		}

		const length = this.searchQueue.peekLength();
		this.searchQueue.dequeue();
		if (!nextHub.bestVisit) {
			nextHub.bestVisit = nextTunnel;
			this.queueTunnels(nextTunnel.end, length);
		}
		this.assignMissingTermites();
	}

	public resetSearch() {
		for (const hub of this.hubs) {
			hub.bestVisit = null;
		}
		for (const tunnel of this.tunnels) {
			tunnel.throughput = 0;
		}
		this.assignedTermites = 0;
		this.assignedTermiteMap.set(HubType.food, 0);
		this.assignedTermiteMap.set(HubType.mud, 0);
		this.assignedTermiteMap.set(HubType.feces, 0);
		this.searchQueue.clear();
		this.queueTunnels(this.home, 0);
		this.assignMissingTermites();
	}

	public addTunnel(begin: Hub, end: Hub, type: TunnelType): Tunnel | null {
		if (begin == end) {
			return null;
		}
		const tunnel = new Tunnel(begin, end, type);
		this.tunnels.push(tunnel);

		super.dispatchEvent(new CustomEvent('addedTunnel', {detail: {'tunnel': tunnel, 'allTunnels': this.tunnels}}));

		this.resetSearch();
		return tunnel;
	}

	public addHub(x: number, y: number, type: HubType, size: number): Hub {
		const hub = new Hub(x, y, type, size);
		this.hubs.push(hub);

		super.dispatchEvent(new CustomEvent('addedHub', {detail: {'hub': hub, 'allHubs': this.hubs}}));
		return hub;
	}

	public selectTool(tool: Tool) {
		this.selectedTool = tool;
	}

	private estimateRoute(endTunnel: Tunnel): { length: number, minThroughput: number } | null {
		const hub = endTunnel.begin;

		// Verify this tunnel.
		const tunnelMissingThroughput = endTunnel.type - endTunnel.throughput;
		if (tunnelMissingThroughput <= 0) {
			return null;
		}

		const nextTunnel = hub.bestVisit;
		if (hub.type === HubType.home || !nextTunnel) {
			return {length: endTunnel.length, minThroughput: tunnelMissingThroughput};
		}

		const result = this.estimateRoute(nextTunnel);
		if (result) {
			return {
				length: result.length + endTunnel.length,
				minThroughput: Math.min(result.minThroughput, tunnelMissingThroughput),
			};
		}

		return null;
	}

	private placeTermites(throughput: number, tunnel: Tunnel) {
		// TODO: Maybe move the while loop from TryAssignTermites down here. Removing objects here if their throughput is full. Then we dont need the logic to check for full throughput's in the other function.
		tunnel.throughput += throughput;
		const hub = tunnel.begin;
		const nextTunnel = hub.bestVisit;
		if (hub.type === HubType.home || !nextTunnel) {
			return;
		}
		this.placeTermites(throughput, nextTunnel);
	}

	private queueTunnels(hub: Hub, accLength: number) {
		for (const tunnel of hub.tunnels) {
			if (!tunnel.end.bestVisit) {
				tunnel.ensureBeginHub(hub);
				this.searchQueue.enqueue(accLength + tunnel.length, tunnel);
			}
		}
	}

	private updateInventory() {
		this.inventory.food += this.assignedTermiteMap.get(HubType.food) ?? 0;
		this.inventory.mud += this.assignedTermiteMap.get(HubType.mud) ?? 0;
		this.inventory.feces += this.assignedTermiteMap.get(HubType.feces) ?? 0;
	}

	private onTick(time: number) {
		super.dispatchEvent(new CustomEvent('tick', {detail: {'time': time}}));
		requestAnimationFrame(this.onTick.bind(this));
	}
}