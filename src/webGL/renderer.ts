import {Game, Tool} from '../logic/game.ts';
import {Hubs} from './hubs.ts';
import {Tunnels} from './tunnels.ts';
import {Hub, HubType} from '../models/hub.ts';
import {TunnelType} from '../models/tunnel.ts';

export class Renderer {
	private readonly hubSnap: number = 0.02;
	private readonly gl: WebGL2RenderingContext;
	private readonly canvas: HTMLCanvasElement;
	private readonly game: Game;
	private readonly tunnels: Tunnels;
	private readonly hubs: Hubs;
    private cameraMove: boolean = false;
    private cameraX: number = 0;
    private cameraY: number = 0;

	constructor(canvas: HTMLCanvasElement, game: Game) {
		this.canvas = canvas;
		const gl = this.canvas.getContext('webgl2', { antialias: true });
		if (!gl) {
			throw Error('WebGL2 not supported.');
		}
		this.gl = gl;
		this.game = game;

		this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
		this.gl.enable(this.gl.BLEND);
		this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

		this.tunnels = new Tunnels(this.gl);
		this.tunnels.setTunnels(this.game.tunnels);
		this.hubs = new Hubs(this.gl);
		this.hubs.setHubs(this.game.hubs);

		this.game.addEventListener('addedTunnel', this.onAddedTunnel.bind(this));
		this.game.addEventListener('addedHub', this.onAddedHub.bind(this));
		this.game.addEventListener('tick', this.tick.bind(this));

		this.canvas.addEventListener('mousedown', this.mouseDown.bind(this));
		this.canvas.addEventListener('mousemove', this.mouseMove.bind(this));
		this.canvas.addEventListener('mouseup', this.mouseUp.bind(this));
		this.canvas.addEventListener('contextmenu', ev => {
			ev.preventDefault();
		}, true);
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

		this.tunnels.draw(this.game.time);
		this.hubs.draw();

		const error = this.gl.getError();
		if (error != this.gl.NO_ERROR) {
			console.error(error);
		}
	}

	private convertMouseCoordsToWorld(x: number, y: number) {
		const rect = this.canvas.getBoundingClientRect();

        const canvasX = x - rect.left;
        const cameraX = canvasX / this.canvas.width * 2 - 1;
        const worldX = cameraX - this.cameraX;

        const canvasY = y - rect.top;
        const cameraY = 1 - canvasY / this.canvas.height * 2;
        const worldY = cameraY - this.cameraY;
		return {x: worldX, y:  worldY };
	}

    private nearestHub(x: number, y: number, maxDistance: number): Hub | null {
        let closestHub: Hub | null = null;
        let closestDistance = maxDistance;
        for (let i = 0; i < this.game.hubs.length; i++) {
            const hub = this.game.hubs[i];
            const distance = Math.pow(hub.x - x, 2) + Math.pow(hub.y - y, 2);
            if (distance < closestDistance) {
                closestHub = hub;
                closestDistance = distance;
            }
        }
        return closestHub;
    }

	private mouseDown(ev: MouseEvent) {
        if (ev.button == 2){
            this.cameraMove = true;
        }
        if (ev.button != 0){
            return;
        }

		switch (this.game.selectedTool) {
			case Tool.None:
				return;
			case Tool.DigTunnel: {
				const pos = this.convertMouseCoordsToWorld(ev.clientX, ev.clientY);
				const hub = this.nearestHub(pos.x, pos.y, this.hubSnap);
				if (hub) {
					this.tunnels?.placementBegin(hub);
				}
				break;
			}
			case Tool.UpgradeTunnel: {
                const pos = this.convertMouseCoordsToWorld(ev.clientX, ev.clientY);
                const hub = this.nearestHub(pos.x, pos.y, this.hubSnap);
                if (hub) {
                    this.tunnels?.placementBegin(hub);
                }
                break;
			}
		}
	}

	private mouseMove(ev: MouseEvent) {
        if (this.cameraMove) {
            this.cameraX += ev.movementX / 1000;
            this.cameraY -= ev.movementY / 1000;
            this.tunnels.updateCamera(this.cameraX, this.cameraY);
            this.hubs.updateCamera(this.cameraX, this.cameraY);
        }

        switch (this.game.selectedTool){
            case Tool.None:
                break;
            case Tool.DigTunnel: {
                const pos = this.convertMouseCoordsToWorld(ev.clientX, ev.clientY);
                const hub = this.nearestHub(pos.x, pos.y, this.hubSnap);
                if (hub) {
                    this.tunnels?.placementUpdate(hub.x, hub.y, hub.tunnels.length == 0);
                } else {
                    this.tunnels?.placementUpdate(pos.x, pos.y, true);
                }
                break;
            }
            case Tool.UpgradeTunnel: {
				const pos = this.convertMouseCoordsToWorld(ev.clientX, ev.clientY);
				const hub = this.nearestHub(pos.x, pos.y, this.hubSnap);
				if (hub) {
					this.tunnels?.placementUpdate(hub.x, hub.y, hub.tunnels.length == 0);
				} else {
					this.tunnels?.placementUpdate(pos.x, pos.y, true);
				}
                break;
            }
        }
	}

	private mouseUp(ev: MouseEvent) {
        if (ev.button == 2){
            this.cameraMove = false;
        }
        if (ev.button != 0){
            return;
        }

        switch (this.game.selectedTool) {
			case Tool.None:
				return;
			case Tool.DigTunnel: {
				const pos = this.convertMouseCoordsToWorld(ev.clientX, ev.clientY);
				const placement = this.tunnels?.placementEnd();
				if (placement) {
					let hub = this.nearestHub(pos.x, pos.y, this.hubSnap);
					if (hub && hub.tunnels.length != 0){
						return;
					}
					if (!hub) {
						hub = this.game.addHub(placement.x, placement.y, HubType.none, 1);
					}
					this.game.addTunnel(placement.hub, hub, TunnelType.dug);
				}
				break;
			}
			case Tool.UpgradeTunnel: {
                const pos = this.convertMouseCoordsToWorld(ev.clientX, ev.clientY);
                const placement = this.tunnels?.placementEnd();
                if (placement) {
                    let hub = this.nearestHub(pos.x, pos.y, this.hubSnap);
					if (hub && hub.tunnels.length != 0){
						return;
					}
                    if (!hub) {
                        hub = this.game.addHub(placement.x, placement.y, HubType.food, Math.random() * 10);
                    }
                    this.game.addTunnel(placement.hub, hub, TunnelType.mud);
                }
                break;
            }
		}
	}
}