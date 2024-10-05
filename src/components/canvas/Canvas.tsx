import {FC, useEffect, useRef} from 'react';
import {Tunnels} from '../../webGL/tunnels.ts';
import {Hubs} from "../../webGL/hubs.ts";
import {useAppDispatch, useAppSelector} from "../../state/hooks.ts";
import {addTunnel} from "../../state/features/game/gameSlice.ts";

interface Props {
	width: number;
	height: number;
}

function convertMouseCoordsToWorld(canvas: HTMLCanvasElement, x: number, y: number) {
	const rect = canvas.getBoundingClientRect();
	return {x: (x - rect.left) / canvas.width * 2 - 1, y: 1 - (y - rect.top) / canvas.height * 2};
}

export const Canvas: FC<Props> = (props) => {
	const {width, height} = props;
	const dispatch = useAppDispatch();
	const {tunnels: tunnelsArr, hubs: hubsArr} = useAppSelector(state => state.game)
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const tunnelsRef = useRef<Tunnels | null>(null);
	const hubsRef = useRef<Hubs | null>(null);

	useEffect(() => {
		const tunnels = tunnelsRef.current;
		if (tunnels){
			tunnels.setTunnels(tunnelsArr);
		}
	}, [tunnelsArr, tunnelsRef]);
	useEffect(() => {
		const hubs = hubsRef.current;
		if (hubs){
			hubs.setHubs(hubsArr)
		}
	}, [hubsArr, hubsRef]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas) {
			const gl = canvas.getContext('webgl2');
			if (!gl) {
				console.error('WebGL2 not supported');
				return;
			}
			let tunnels = tunnelsRef.current;
			if (!tunnels) {
				tunnels = new Tunnels(gl);
				tunnelsRef.current = tunnels;
			}
			let hubs = hubsRef.current;
			if (!hubs){
				hubs = new Hubs(gl);
				hubsRef.current = hubs;
			}

			gl.viewport(0, 0, width, height);
			gl.clearColor(0.0, 0.0, 0.0, 1.0);
			gl.enable(gl.BLEND);
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

			canvas.addEventListener('mousedown', ev => {
				const pos = convertMouseCoordsToWorld(canvas, ev.clientX, ev.clientY);
				let closestHub = hubsArr[0];
				let closestDistance = Math.pow(hubsArr[0].x - pos.x, 2) + Math.pow(hubsArr[1].y - pos.y, 2);
				for (const hub of hubsArr){
					const distance = Math.pow(hub.x - pos.x, 2) + Math.pow(hub.y - pos.y, 2);
					if (distance < closestDistance) {
						closestHub = hub;
						closestDistance = distance;
					}
				}
				tunnels?.placementBegin(closestHub);
			});
			canvas.addEventListener('mousemove', ev => {
				const pos = convertMouseCoordsToWorld(canvas, ev.clientX, ev.clientY);
				tunnels?.placementUpdate(pos.x, pos.y);
			});
			canvas.addEventListener('mouseup', () => {
				// const pos = convertMouseCoordsToWorld(canvas, ev.clientX, ev.clientY);
				const placement = tunnels?.placementEnd();
				if (placement){
					console.log(placement);
					dispatch(addTunnel(placement));
				}
			});

			const renderFrame = () => {
				gl.clear(gl.COLOR_BUFFER_BIT);

				tunnels.draw();
				hubs.draw();

				const error = gl.getError();
				if (error != gl.NO_ERROR) {
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
	);
};