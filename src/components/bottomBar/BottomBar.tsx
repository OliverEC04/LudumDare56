import {Paper, SxProps} from '@mui/material';
import {BottomBarButton} from './BottomBarButton.tsx';
import testIcon from '../../assets/testIcon.png';
import {Game, Tool} from '../../logic/game.ts';
import {FC, useCallback} from 'react';

interface Props {
	game: Game;
}

export const BottomBar: FC<Props> = (props) => {
	const {game} = props;

	const setTool = useCallback((tool: Tool) => {
		if (game.selectedTool === tool) {
			game.selectTool(Tool.None);
			return;
		}

		game.selectTool(tool);
	}, [game]);

	return (
		<Paper sx={styles.container}>
			<BottomBarButton label="digTunnel" icon={testIcon} onclick={() => setTool(Tool.DigTunnel)}/>
			<BottomBarButton label="upgradeTunnel" icon={testIcon} onclick={() => setTool(Tool.UpgradeTunnel)}/>
		</Paper>
	);
};

const styles: { [key: string]: SxProps } = {
	container: {
		position: 'absolute',
		bottom: 0,
		display: 'flex',
		backgroundColor: '#f0f0f040',
		gap: 1,
		padding: 1,
	},
};