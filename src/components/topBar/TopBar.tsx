import {Paper, SxProps} from '@mui/material';
import {TopBarTile} from './TopBarTile.tsx';

export const TopBar = () => {
	return (
		<Paper sx={styles.container}>
			<TopBarTile label="Termites" value={10}/>
		</Paper>
	);
};

const styles: { [key: string]: SxProps } = {
	container: {
		position: 'absolute',
	},
};