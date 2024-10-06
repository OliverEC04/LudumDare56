import {VertexArray} from './vertexArray.ts';
import {Shader} from './shader.ts';
import {Buffer} from './buffer.ts';
import {Tunnel, TunnelType} from '../models/tunnel.ts';
import {Hub} from '../models/hub.ts';

const vertexSource = `
    attribute float aOffset;
    attribute float aPoint;
    attribute vec2 aBegin;
    attribute vec2 aEnd;
    attribute float aSize;
    attribute vec4 aColor;
    
    uniform vec2 uCameraPos;
    
    varying vec4 vColor;
    
    void main(){
        vec2 point = step(aPoint, 0.5) * aBegin + step(0.5, aPoint) * aEnd;
        vec2 lineDir = aEnd - aBegin;
        vec2 perpVec = vec2(-lineDir.y, lineDir.x) * (step(aOffset, 0.0) * 2.0 - 1.0);
        gl_Position = vec4(point + normalize(perpVec) * aSize + uCameraPos, 0, 1);
        vColor = aColor;
    }
`;

const fragmentSource = `
    precision mediump float;

    varying vec4 vColor;

    void main(){
        gl_FragColor = vColor;
    }
`;

export class Tunnels {
	private readonly gl: WebGL2RenderingContext;
	private readonly vao: VertexArray;
	private readonly shader: Shader;
	private readonly instanceBuffer: Buffer;
	private startHub: Hub | null = null;
	private readonly placementTunnel: Float32Array;
	private instances: Array<number>;
	private readonly cameraPosUniformLocation: WebGLUniformLocation | null;

	constructor(gl: WebGL2RenderingContext) {
		this.gl = gl;
		this.shader = new Shader(this.gl, vertexSource, fragmentSource);
		this.cameraPosUniformLocation = this.shader.getUniformLocation("uCameraPos");

		this.vao = new VertexArray(gl, this.shader);

		const vbo = new Buffer(this.gl, this.gl.ARRAY_BUFFER);
		vbo.setData(new Float32Array([
			// offset   point
			1, 0,
			1, 1,
			-1, 1,
			-1, 0,
			1, 0,
			-1, 1,
		]), this.gl.STATIC_DRAW);
		this.vao.addAttribute(vbo, 'aOffset', 1, this.gl.FLOAT, 8, 0);
		this.vao.addAttribute(vbo, 'aPoint', 1, this.gl.FLOAT, 8, 4);

		this.instances = [];
		this.placementTunnel = new Float32Array(9);
		this.instanceBuffer = new Buffer(this.gl, this.gl.ARRAY_BUFFER);
		this.vao.addAttribute(this.instanceBuffer, 'aBegin', 2, this.gl.FLOAT, 36, 0, 1);
		this.vao.addAttribute(this.instanceBuffer, 'aEnd', 2, this.gl.FLOAT, 36, 8, 1);
		this.vao.addAttribute(this.instanceBuffer, 'aSize', 1, this.gl.FLOAT, 36, 16, 1);
		this.vao.addAttribute(this.instanceBuffer, 'aColor', 4, this.gl.FLOAT, 36, 20, 1);

		this.setTunnels([]);
	}

	public updateCamera(cameraX: number, cameraY: number){
		this.shader.bind();
		this.gl.uniform2f(this.cameraPosUniformLocation, cameraX, cameraY);
	}

	public placementBegin(hub: Hub, size: number = 0.01) {
		this.startHub = hub;
		this.placementTunnel[0] = hub.x;
		this.placementTunnel[1] = hub.y;
		this.placementTunnel[4] = size;
		this.placementTunnel[5] = 0.4;
		this.placementTunnel[6] = 0.4;
		this.placementTunnel[7] = 0.4;
		this.placementTunnel[8] = 1;
		this.instanceBuffer.setSubData(new Float32Array(this.placementTunnel), 0);
	}


	public placementUpdate(x: number, y: number, enabled: boolean) {
		this.placementTunnel[2] = x;
		this.placementTunnel[3] = y;
		if (enabled){
			this.placementTunnel[5] = 0.4;
			this.placementTunnel[6] = 0.4;
			this.placementTunnel[7] = 0.4;
			this.placementTunnel[8] = 1;
		}
		else {
			this.placementTunnel[5] = 0.8;
			this.placementTunnel[6] = 0.2;
			this.placementTunnel[7] = 0.1;
			this.placementTunnel[8] = 1;
		}
		this.instanceBuffer.setSubData(new Float32Array(this.placementTunnel), 0);
		this.instanceBuffer.setSubData(new Float32Array(this.placementTunnel), 0);
	}

	public placementEnd(): { hub: Hub, x: number, y: number } | null {
		if (this.startHub === null) {
			return null;
		}
		const retVal = {
			hub: this.startHub,
			x: this.placementTunnel[2],
			y: this.placementTunnel[3],
		};

		this.startHub = null;
		this.placementTunnel.fill(0, 0, -1);
		this.instances.fill(0, 0, this.placementTunnel.length - 1);
		this.instanceBuffer.setSubData(new Float32Array(this.placementTunnel), 0);
		return retVal;
	}

	public setTunnels(tunnels: Tunnel[]) {
		this.instances = new Array<number>(9);
		for (const tunnel of tunnels) {
			const beginX = tunnel.begin.x;
			const beginY = tunnel.begin.y;
			const endX = tunnel.end.x;
			const endY = tunnel.end.y;
			let size = 0;
			let r = 0, g = 0, b = 0;
			switch (tunnel.type) {
				case TunnelType.dug:
					size = 0.01;
					r = 0.8;
					g = 0.4;
					b = 0.1;
					break;
				case TunnelType.mud:
					size = 0.02;
					r = 0.7;
					g = 0.4;
					b = 0.1;
					break;
				case TunnelType.feces:
					size = 0.03;
					r = 0.6;
					g = 0.3;
					b = 0.1;
					break;
			}
			this.instances.push(beginX, beginY, endX, endY, size, r, g, b, 1);
		}
		this.instanceBuffer.setData(new Float32Array(this.instances), this.gl.DYNAMIC_DRAW);
	}

	public draw() {
		this.vao.bind();
		this.shader.bind();
		this.gl.drawArraysInstanced(this.gl.TRIANGLES, 0, 6, this.instances.length / this.placementTunnel.length);
	}
}