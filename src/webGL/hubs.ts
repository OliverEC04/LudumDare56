import {VertexArray} from "./vertexArray.ts";
import {Shader} from "./shader.ts";
import {Buffer} from "./buffer.ts";
import {Hub, HubType} from "../models/hub.ts";

const vertexSource = `
    attribute vec2 aLocalPos;
    attribute vec2 aGlobalPos;
    attribute float aSize;
    attribute vec4 aColor;
    
    varying vec4 vColor;
    varying vec2 vPos;
    
    void main(){
        gl_Position = vec4(aLocalPos * aSize + aGlobalPos, 0, 1);
        vColor = aColor;
        
        vPos = aLocalPos * 2.0;
    }
`;

const fragmentSource = `
    precision mediump float;

    varying vec4 vColor;
    varying vec2 vPos;

    void main(){
        gl_FragColor = vColor * step(length(vPos), 1.0);
    }
`;

export class Hubs {
    private readonly gl: WebGL2RenderingContext;
    private readonly vao: VertexArray;
    private readonly shader: Shader;
    private readonly instanceBuffer: Buffer;
    private instances: Array<number>;

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

        this.setHubs([]);
    }

    public setHubs(hubs: Hub[]){
        this.instances = [];
        for (const hub of hubs){
            const x = hub.x;
            const y = hub.y;
            let size = hub.size;
            let r = 0, g = 0, b = 0;
            switch (hub.type){
                case HubType.none:
                    size = 0.02;
                    r = 0.8;
                    g = 0.4;
                    b = 0.1;
                    break;
                case HubType.food:
                    size *= 0.01;
                    r = 0.5;
                    g = 0.8;
                    b = 0.5;
                    break;
                case HubType.mud:
                    size *= 0.01;
                    r = 0.8;
                    g = 0.4;
                    b = 0.1;
                    break;
                case HubType.feces:
                    size *= 0.01;
                    r = 0.8;
                    g = 0.4;
                    b = 0.1;
                    break;
                case HubType.home:
                    size *= 0.01;
                    r = 1;
                    g = 1;
                    b = 1;
                    break;

            }
            this.instances.push(x, y, size, r, g, b, 1);
        }
        this.instanceBuffer.setData(new Float32Array(this.instances), this.gl.STATIC_DRAW);
    }

    public draw(){
        this.vao.bind();
        this.shader.bind();
        this.gl.drawArraysInstanced(this.gl.TRIANGLES, 0, 6, this.instances.length / 7);
    }
}