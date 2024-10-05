import {VertexArray} from "./vertexArray.ts";
import {Shader} from "./shader.ts";
import {Buffer} from "./buffer.ts";

const vertexSource = `
    attribute float aOffset;
    attribute float aPoint;
    attribute vec2 aBegin;
    attribute vec2 aEnd;
    attribute float aSize;
    
    void main(){
        vec2 point = step(aPoint, 0.5) * aBegin + step(0.5, aPoint) * aEnd;
        vec2 lineDir = aEnd - aBegin;
        vec2 perpVec = vec2(-lineDir.y, lineDir.x) * (step(aOffset, 0.0) * 2.0 - 1.0);
        gl_Position = vec4(point + normalize(perpVec) * aSize, 0, 1);
    }
`;

const fragmentSource = `
    precision mediump float;

    void main(){
        gl_FragColor = vec4(0.85, 0.4, 0.1, 1);
    }
`;

export class Tunnels{
    private readonly gl: WebGL2RenderingContext;
    private readonly vao: VertexArray;
    private readonly shader: Shader;
    private readonly instanceBuffer: Buffer;
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

        this.instanceBuffer = new Buffer(this.gl, this.gl.ARRAY_BUFFER);
        this.instances = [];
        this.vao.addAttribute(this.instanceBuffer, "aBegin", 2, this.gl.FLOAT, 20, 0, 1);
        this.vao.addAttribute(this.instanceBuffer, "aEnd", 2, this.gl.FLOAT, 20, 8, 1);
        this.vao.addAttribute(this.instanceBuffer, "aSize", 1, this.gl.FLOAT, 20, 16, 1);
    }

    public addTunnel(beginX: number, beginY: number, endX: number, endY: number, size: number = 0.01){
        this.instances.push(beginX, beginY, endX, endY, size);
        this.instanceBuffer.setData(new Float32Array(this.instances), this.gl.STATIC_DRAW);
    }

    public draw(){
        this.vao.bind();
        this.shader.bind();
        this.gl.drawArraysInstanced(this.gl.TRIANGLES, 0, 6, this.instances.length / 5);
    }
}