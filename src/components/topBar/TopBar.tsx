import {Box, SxProps} from '@mui/material';

export const TopBar = () => {
	return (
		<Box sx={styles.container}>
			TopBar
		</Box>
	);
};

const styles: { [key: string]: SxProps } = {
	container: {
		position: 'absolute',
	},
};