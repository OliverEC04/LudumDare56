export class Buffer{
    private readonly gl: WebGL2RenderingContext;
    private readonly target: GLenum;
    private readonly handle: WebGLBuffer;

    constructor(gl: WebGL2RenderingContext, target: GLenum) {
        this.gl = gl;
        const handle = this.gl.createBuffer();
        if (!handle) throw Error("Failed to instantiate buffer.");
        this.handle = handle;
        this.target = target;
    }

    public setSubData(data: BufferSource, offset: number){
        this.bind();
        this.gl.bufferSubData(this.target, offset, data);
    }

    public setData(data: BufferSource, usage: GLenum = this.gl.STATIC_DRAW) {
        this.bind();
        this.gl.bufferData(this.target, data, usage);
    }

    public bind(){
        this.gl.bindBuffer(this.target, this.handle);
    }
}