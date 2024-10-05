import {FC, useEffect, useRef} from "react";
import {Tunnels} from "../../webGL/tunnels.ts";

interface Props
{
    width: number;
    height: number;
}

function convertMouseCoordsToWorld(canvas: HTMLCanvasElement, x: number, y: number){
    const rect = canvas.getBoundingClientRect();
    return {x: (x - rect.left) / canvas.width * 2 - 1, y: 1 - (y - rect.top) / canvas.height * 2};
}

export const Canvas: FC<Props> = (props) => {
    const {width, height} = props;
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const tunnelsRef = useRef<Tunnels | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const gl = canvas.getContext('webgl2');
            if (!gl) {
                console.error('WebGL2 not supported');
                return;
            }
            let tunnels = tunnelsRef.current;
            if (!tunnels){
                tunnels = new Tunnels(gl);
                tunnelsRef.current = tunnels;
            }

            gl.viewport(0, 0, width, height);
            gl.clearColor(0.0, 0.0, 0.0, 1.0);

            canvas.addEventListener("mouseup", () => {
                tunnels?.placeTunnel();
                tunnels?.placementTunnelSize(0);
            });
            canvas.addEventListener("mousedown", ev => {
                const pos = convertMouseCoordsToWorld(canvas, ev.clientX, ev.clientY);
                tunnels?.placementTunnelBegin(pos.x, pos.y);
                tunnels?.placementTunnelSize();
            });
            canvas.addEventListener("mousemove", ev => {
                const pos = convertMouseCoordsToWorld(canvas, ev.clientX, ev.clientY);
                tunnels?.placementTunnelEnd(pos.x, pos.y)
            });

            const renderFrame = () => {
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
    }, [width, height]);
    return (
        <canvas ref={canvasRef}
                width={width}
                height={height}
                style={{
                    width: width,
                    height: height,
                }}>
        </canvas>
    )
}