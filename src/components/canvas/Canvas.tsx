import {FC, useEffect, useRef} from "react";
import {Tunnels} from "../../webGL/tunnels.ts";

interface Props
{
    width: number;
    height: number;
}

export const Canvas: FC<Props> = (props) => {
    const {width, height} = props;
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const glRef = useRef<WebGL2RenderingContext | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const gl = canvas.getContext('webgl2');
            if (!gl) {
                console.error('WebGL2 not supported');
                return;
            }

            glRef.current = gl;
            gl.clearColor(0.0, 0.0, 0.0, 1.0);

            // canvas.addEventListener("mousedown", console.log)
            // canvas.addEventListener("mouseup", console.log)
            // canvas.addEventListener("mousemove", console.log)
            const tunnels = new Tunnels(gl);

            const renderFrame = (time: number) => {
                gl.clearColor(Math.sin(time / 1000) * 0.5 + 1, 0, 0, 1);
                gl.clear(gl.COLOR_BUFFER_BIT);

                tunnels.draw();

                const error = gl.getError();
                if (error != gl.NO_ERROR){
                    console.error(error);
                }

                requestAnimationFrame(renderFrame);
            };

            requestAnimationFrame(renderFrame);
        }
    }, []);
    return (
        <canvas ref={canvasRef}
                width={width}
                height={height}
                style={{
                    width: "100%",
                    height: "100%",
                }}>
        </canvas>
    )
}