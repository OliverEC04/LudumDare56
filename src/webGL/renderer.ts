import {Game, Tool} from '../logic/game.ts';
import {Hubs} from './hubs.ts';
import {Tunnels} from './tunnels.ts';
import {HubType} from '../models/hub.ts';
import {TunnelType} from '../models/tunnel.ts';

export class Renderer {
	private readonly gl: WebGL2RenderingContext;
	private readonly canvas: HTMLCanvasElement;
	private readonly game: Game;
	private readonly tunnels: Tunnels;
	private readonly hubs: Hubs;

	constructor(canvas: HTMLCanvasElement, game: Game) {
		this.canvas = canvas;
		const gl = this.canvas.getContext('webgl2');
		if (!gl) {
			throw Error('WebGL2 not supported.');
		}
		this.gl = gl;
		this.game = game;

		this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
		this.gl.enable(this.gl.BLEND);
		this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

		this.tunnels = new Tunnels(this.gl);
		this.hubs = new Hubs(this.gl);

		this.game.addEventListener('addedTunnel', this.onAddedTunnel.bind(this));
		this.game.addEventListener('addedHub', this.onAddedHub.bind(this));
		this.game.addEventListener('tick', this.tick.bind(this));

		this.canvas.addEventListener('mousedown', this.mouseDown.bind(this));
		this.canvas.addEventListener('mousemove', this.mouseMove.bind(this));
		this.canvas.addEventListener('mouseup', this.mouseUp.bind(this));
	}

	public resize(width: number, height: number) {
		this.gl.viewport(0, 0, width, height);
	}

	private onAddedTunnel() {
		this.tunnels.setTunnels(this.game.tunnels);
	}

	private onAddedHub() {
		this.hubs.setHubs(this.game.hubs);
	}

	private tick() {
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);

		this.tunnels.draw();
		this.hubs.draw();

		const error = this.gl.getError();
		if (error != this.gl.NO_ERROR) {
			console.error(error);
		}
	}

	private convertMouseCoordsToWorld(x: number, y: number) {
		const rect = this.canvas.getBoundingClientRect();
		return {x: (x - rect.left) / this.canvas.width * 2 - 1, y: 1 - (y - rect.top) / this.canvas.height * 2};
	}

	private mouseDown(ev: MouseEvent) {
		switch (this.game.selectedTool) {
			case Tool.None:
				return;
			case Tool.DigTunnel: {
				const pos = this.convertMouseCoordsToWorld(ev.clientX, ev.clientY);
				let closestHub = this.game.hubs[0];
				let closestDistance = Math.pow(this.game.hubs[0].x - pos.x, 2) + Math.pow(this.game.hubs[1].y - pos.y, 2);
				for (let i = 0; i < this.game.hubs.length; i++) {
					const hub = this.game.hubs[i];
					const distance = Math.pow(hub.x - pos.x, 2) + Math.pow(hub.y - pos.y, 2);
					if (distance < closestDistance) {
						closestHub = hub;
						closestDistance = distance;
					}
				}
				this.tunnels?.placementBegin(closestHub);
				break;
			}
			case Tool.UpgradeTunnel: {
				console.log('Upgrade tool not implemented');
			}
		}
	}

	private mouseMove(ev: MouseEvent) {
		if (this.game.selectedTool === Tool.None) return;

		const pos = this.convertMouseCoordsToWorld(ev.clientX, ev.clientY);
		this.tunnels?.placementUpdate(pos.x, pos.y);
	}

	private mouseUp() {
		switch (this.game.selectedTool) {
			case Tool.None:
				return;
			case Tool.DigTunnel: {
				// const pos = this.convertMouseCoordsToWorld(ev.clientX, ev.clientY);
				const placement = this.tunnels?.placementEnd();
				if (placement) {
					const hub = this.game.addHub(placement.x, placement.y, HubType.none, 1, 0);
					this.game.addTunnel(placement.hub, hub, TunnelType.dug);
				}
				break;
			}
			case Tool.UpgradeTunnel: {
				console.log('Upgrade tool not implemented');
			}
		}

	}
}