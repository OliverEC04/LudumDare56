import {VertexArray} from "./vertexArray.ts";
import {Shader} from "./shader.ts";
import {Buffer} from "./buffer.ts";

const vertexSource = `
    attribute vec2 aLocalPos;
    attribute vec2 aGlobalPos;
    attribute float aSize;
    attribute vec4 aColor;
    
    varying vec4 vColor;
    
    void main(){
        gl_Position = vec4(aLocalPos * aSize + aGlobalPos, 0, 1);
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

export class Hubs {
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
            // aLocalPos
            -0.5, -0.5,
            -0.5, 0.5,
            0.5, 0.5,
            -0.5, -0.5,
            0.5, 0.5,
            0.5, -0.5
        ]), this.gl.STATIC_DRAW);
        this.vao.addAttribute(vbo, "aLocalPos", 2, this.gl.FLOAT, 8, 0);

        this.instances = [];
        this.instanceBuffer = new Buffer(this.gl, this.gl.ARRAY_BUFFER);
        this.vao.addAttribute(this.instanceBuffer, "aGlobalPos", 2, this.gl.FLOAT, 28, 0, 1);
        this.vao.addAttribute(this.instanceBuffer, "aSize", 1, this.gl.FLOAT, 28, 8, 1);
        this.vao.addAttribute(this.instanceBuffer, "aColor", 4, this.gl.FLOAT, 28, 12, 1);
    }

    public addHub(x: number, y: number, size: number = 0.05){
        this.instances.push(x, y, size, 1, 1, 1, 1);
        this.instanceBuffer.setData(new Float32Array(this.instances))
    }

    public draw(){
        this.vao.bind();
        this.shader.bind();
        this.gl.drawArraysInstanced(this.gl.TRIANGLES, 0, 6, this.instances.length / 7);
    }
}