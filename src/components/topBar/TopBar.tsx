import {Paper, SxProps} from '@mui/material';
import {TopBarTile} from './TopBarTile.tsx';
import {useAppSelector} from '../../state/hooks.ts';

export const TopBar = () => {
	const {termites} = useAppSelector((state) => state.game);

	return (
		<Paper sx={styles.container}>
			<TopBarTile label="Termites" value={termites}/>
		</Paper>
	);
};

const styles: { [key: string]: SxProps } = {
	container: {
		position: 'absolute',
	},
};