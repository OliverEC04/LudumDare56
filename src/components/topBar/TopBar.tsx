import {Paper, SxProps} from '@mui/material';
import {TopBarTile} from './TopBarTile.tsx';
import {Game} from '../../logic/game.ts';
import {FC} from 'react';
import testIcon from '../../assets/testIcon.png';

interface Props {
	game: Game;
}

export const TopBar: FC<Props> = (props) => {
	const {game} = props;

	return (
		<Paper sx={styles.container}>
			<TopBarTile icon={testIcon} text="Termites" label="termites" value={game.termiteCount}/>
		</Paper>
	);
};

const styles: { [key: string]: SxProps } = {
	container: {
		position: 'absolute',
		backgroundColor: '#f0f0f040',
		color: '#ffffffe0',
		gap: 4,
		padding: 1,
		display: 'flex',
	},
};