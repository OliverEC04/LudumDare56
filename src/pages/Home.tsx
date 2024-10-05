import {Box, SxProps} from '@mui/material';
import {Canvas} from '../components/canvas/Canvas.tsx';
import {BottomBar} from '../components/bottomBar/BottomBar.tsx';
import {useWindowSize} from '../state/hooks/windowSize.tsx';
import {TopBar} from '../components/topBar/TopBar.tsx';
import {Game} from '../logic/game.ts';

export const Home = () => {
	const {width: windowWidth, height: windowHeight} = useWindowSize();

	const game = new Game();

	return (
		<Box sx={styles.container}>
			<TopBar game={game}/>
			<Canvas width={windowWidth} height={windowHeight} game={game}></Canvas>
			<BottomBar game={game}/>
		</Box>
	);
};

const styles: { [key: string]: SxProps } = {
	container: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
};