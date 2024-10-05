export class Shader{
    private readonly gl: WebGL2RenderingContext;
    private readonly handle: WebGLProgram;

    constructor(gl: WebGL2RenderingContext, vertexSource: string, fragmentSource: string) {
        this.gl = gl;
        const handle = gl.createProgram();
        if (!handle) throw Error("Failed to instantiate shader program.");
        this.handle = handle;

        const vert = this.createShader(vertexSource, this.gl.VERTEX_SHADER);
        const frag = this.createShader(fragmentSource, this.gl.FRAGMENT_SHADER);

        this.gl.attachShader(this.handle, vert);
        this.gl.attachShader(this.handle, frag);

        this.gl.linkProgram(this.handle);
        if (!this.gl.getProgramParameter(this.handle, this.gl.LINK_STATUS)) {
            const info = this.gl.getProgramInfoLog(this.handle);
            this.gl.deleteProgram(this.handle);
            throw new Error(`Failed to link program: ${info}`);
        }

        this.gl.detachShader(this.handle, vert);
        this.gl.deleteShader(vert);
        this.gl.detachShader(this.handle, frag);
        this.gl.deleteShader(frag);
    }

    private createShader(shaderSource: string, shaderType: GLenum){
        const shader = this.gl.createShader(shaderType);
        if (!shader) throw Error("Failed to instantiate shader.");
        this.gl.shaderSource(shader, shaderSource);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)){
            const info = this.gl.getShaderInfoLog(shader);
            this.gl.deleteShader(shader);
            throw new Error(`Shader compilation failed ${info}`);
        }
        return shader;
    }

    public bind(){
        this.gl.useProgram(this.handle);
    }

    public getUniformLocation(name: string){
        return this.gl.getUniformLocation(this.handle, name);
    }

    public getAttribLocation(name: string){
        return this.gl.getAttribLocation(this.handle, name);
    }
}