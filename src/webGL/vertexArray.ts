import {Shader} from "./shader.ts";
import {Buffer} from "./buffer.ts";

export class VertexArray {
    private readonly gl: WebGL2RenderingContext;
    private readonly handle: WebGLVertexArrayObject;
    private readonly shader: Shader;

    constructor(gl: WebGL2RenderingContext, shader: Shader) {
        this.gl = gl;
        const handle = this.gl.createVertexArray();
        if (!handle) throw Error("Failed to instantiate vertex array");
        this.handle = handle;
        this.shader = shader;
    }

    addAttribute(buffer: Buffer, name: string, size: number, type: GLenum, stride: number, offset: number, divisor: number = 0){
        this.bind();
        buffer.bind();
        const location = this.shader.getAttribLocation(name);
        if (location === -1){
            console.warn(`${name} attribute not found.`);
            return;
        }
        this.gl.enableVertexAttribArray(location);
        this.gl.vertexAttribPointer(location, size, type, false, stride, offset);
        this.gl.vertexAttribDivisor(location, divisor);
    }

    addAttributeI(buffer: Buffer, name: string, size: number, type: GLenum, stride: number, offset: number, divisor: number = 0){
        this.bind();
        buffer.bind();
        const location = this.shader.getAttribLocation(name);
        this.gl.enableVertexAttribArray(location);
        this.gl.vertexAttribIPointer(location, size, type, stride, offset);
        this.gl.vertexAttribDivisor(location, divisor);
    }

    bind(){
        this.gl.bindVertexArray(this.handle);
    }
}