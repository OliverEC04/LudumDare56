import {Box, SxProps} from '@mui/material';
import {Canvas} from '../components/canvas/Canvas.tsx';

export const Home = () => {
	return (
		<Box sx={styles.container}>
			<Canvas width={500} height={500}></Canvas>
		</Box>
	);
};

const styles: { [key: string]: SxProps } = {
	container: {
		display: 'flex',
		justifyContent: 'center',
	},
};