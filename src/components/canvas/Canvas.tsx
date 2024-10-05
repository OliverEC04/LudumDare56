import {FC, useEffect, useRef} from 'react';
import {Game} from '../../logic/game.ts';
import {Renderer} from "../../webGL/renderer.ts";

interface Props {
	width: number;
	height: number;
	game: Game;
}


export const Canvas: FC<Props> = (props) => {
	const {width, height, game} = props;

	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const rendererRef = useRef<Renderer | null>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const renderer = rendererRef.current;
		if (!renderer && canvas){
			rendererRef.current = new Renderer(canvas, game);
		}
	}, [game]);

	useEffect(() => {
		const renderer = rendererRef.current;
		if (renderer){
			renderer.resize(width, height);
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