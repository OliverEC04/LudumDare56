import {Box, SxProps} from '@mui/material';
import {Canvas} from '../components/canvas/Canvas.tsx';
import {BottomBar} from '../components/bottomBar/BottomBar.tsx';
import {useWindowSize} from '../state/hooks/windowSize.tsx';
import {TopBar} from '../components/topBar/TopBar.tsx';

export const Home = () => {
	const {width: windowWidth, height: windowHeight} = useWindowSize();

	return (
		<Box sx={styles.container}>
			<TopBar/>
			<Canvas width={windowWidth} height={windowHeight}></Canvas>
			<BottomBar/>
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