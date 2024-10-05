import {Box, SxProps} from '@mui/material';
import {BottomBarButton} from './BottomBarButton.tsx';

export const BottomBar = () => {
	return (
		<Box sx={styles.container}>
			<BottomBarButton label="btn1"/>
			<BottomBarButton label="btn2"/>
		</Box>
	);
};

const styles: { [key: string]: SxProps } = {
	container: {
		// position: 'absolute',
	},
};