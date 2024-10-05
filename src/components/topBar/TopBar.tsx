import {Paper, SxProps} from '@mui/material';

export const TopBar = () => {
	return (
		<Paper sx={styles.container}>
			TopBar
		</Paper>
	);
};

const styles: { [key: string]: SxProps } = {
	container: {
		position: 'absolute',
	},
};