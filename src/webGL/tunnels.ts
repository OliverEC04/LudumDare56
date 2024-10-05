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
        gl_Position = vec4(point + vec2(0, aOffset) * aSize, 0, 1);
    }
`;

const fragmentSource = `
    void main(){
        gl_FragColor = vec4(0, 1, 1, 1);
    }
`;

export class Tunnels{
    private readonly gl: WebGL2RenderingContext;
    private readonly vao: VertexArray;
    private readonly shader: Shader;

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

        const instanceBuffer = new Buffer(this.gl, this.gl.ARRAY_BUFFER);
        instanceBuffer.setData(new Float32Array([
            // aBegin   aEnd    aSize
            -1, 0,      1, 1,   0.01,
            -1, 0.5,      0, -1,   0.04,
        ]), this.gl.STATIC_DRAW);
        this.vao.addAttribute(instanceBuffer, "aBegin", 2, this.gl.FLOAT, 20, 0, 1);
        this.vao.addAttribute(instanceBuffer, "aEnd", 2, this.gl.FLOAT, 20, 8, 1);
        this.vao.addAttribute(instanceBuffer, "aSize", 1, this.gl.FLOAT, 20, 16, 1);
    }

    public draw(){
        this.vao.bind();
        this.shader.bind();
        this.gl.drawArraysInstanced(this.gl.TRIANGLES, 0, 6, 2);
    }
}