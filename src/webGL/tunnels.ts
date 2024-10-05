import {VertexArray} from "./vertexArray.ts";
import {Shader} from "./shader.ts";
import {Buffer} from "./buffer.ts";

const vertexSource = `
    attribute float aOffset;
    attribute float aPoint;
    attribute vec2 aBegin;
    attribute vec2 aEnd;
    attribute float aSize;
    attribute vec4 aColor;
    
    varying vec4 vColor;
    
    void main(){
        vec2 point = step(aPoint, 0.5) * aBegin + step(0.5, aPoint) * aEnd;
        vec2 lineDir = aEnd - aBegin;
        vec2 perpVec = vec2(-lineDir.y, lineDir.x) * (step(aOffset, 0.0) * 2.0 - 1.0);
        gl_Position = vec4(point + normalize(perpVec) * aSize, 0, 1);
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

export class Tunnels{
    private readonly gl: WebGL2RenderingContext;
    private readonly vao: VertexArray;
    private readonly shader: Shader;
    private readonly instanceBuffer: Buffer;
    private readonly placementTunnel: Float32Array;
    private readonly instances: Array<number>;

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
        this.shader = new Shader(this.gl, vertexSource, fragmentSource);

        this.vao = new VertexArray(gl, this.shader);

        const vbo = new Buffer(this.gl, this.gl.ARRAY_BUFFER);
        vbo.setData(new Float32Array([
            // offset   point
                1,      0,
                1,      1,
                -1,     1,
                -1,     0,
                1,      0,
                -1,      1
        ]), this.gl.STATIC_DRAW);
        this.vao.addAttribute(vbo, "aOffset", 1, this.gl.FLOAT, 8, 0);
        this.vao.addAttribute(vbo, "aPoint", 1, this.gl.FLOAT, 8, 4);

        this.instances = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.placementTunnel = new Float32Array(9);
        this.instanceBuffer = new Buffer(this.gl, this.gl.ARRAY_BUFFER);
        this.instanceBuffer.setData(this.placementTunnel, this.gl.DYNAMIC_DRAW);
        this.vao.addAttribute(this.instanceBuffer, "aBegin", 2, this.gl.FLOAT, 36, 0, 1);
        this.vao.addAttribute(this.instanceBuffer, "aEnd", 2, this.gl.FLOAT, 36, 8, 1);
        this.vao.addAttribute(this.instanceBuffer, "aSize", 1, this.gl.FLOAT, 36, 16, 1);
        this.vao.addAttribute(this.instanceBuffer, "aColor", 4, this.gl.FLOAT, 36, 20, 1);
    }

    public beginPlacement(x: number, y: number, size: number = 0.01){
        this.placementTunnel[0] = Math.round(x * 10) / 10;
        this.placementTunnel[1] = Math.round(y * 10) / 10;
        this.placementTunnel[4] = size;
        this.placementTunnel[5] = 0.4;
        this.placementTunnel[6] = 0.4;
        this.placementTunnel[7] = 0.4;
        this.placementTunnel[8] = 1;
        this.instanceBuffer.setSubData(new Float32Array(this.placementTunnel), 0);
    }
    public placementUpdate(x: number, y: number){
        this.placementTunnel[2] = Math.round(x * 10) / 10;
        this.placementTunnel[3] = Math.round(y * 10) / 10;
        this.instanceBuffer.setSubData(new Float32Array(this.placementTunnel), 0);
    }

    public placementEnd(){
        this.placementTunnel[5] = 0.8;
        this.placementTunnel[6] = 0.4;
        this.placementTunnel[7] = 0.1;
        this.placementTunnel[8] = 1;
        for (const f of this.placementTunnel){
            this.instances.push(f);
        }
        this.placementTunnel[4] = 0;

        this.instanceBuffer.setData(new Float32Array(this.instances), this.gl.DYNAMIC_DRAW);
    }

    public draw(){
        this.vao.bind();
        this.shader.bind();
        this.gl.drawArraysInstanced(this.gl.TRIANGLES, 0, 6, this.instances.length / this.placementTunnel.length);
    }
}