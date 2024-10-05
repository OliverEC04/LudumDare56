import {Paper, SxProps} from '@mui/material';
import {BottomBarButton} from './BottomBarButton.tsx';
import testIcon from '../../assets/testIcon.png';
import {Game, Tool} from '../../logic/game.ts';
import {FC, useCallback, useState} from 'react';

interface Props {
	game: Game;
}

export const BottomBar: FC<Props> = (props) => {
	const {game} = props;

	const [selectedTool, setSelectedTool] = useState<Tool>(Tool.None);

	const setTool = useCallback((tool: Tool) => {
		const newTool = game.selectedTool === tool ? Tool.None : tool;
		setSelectedTool(newTool);
		game.selectTool(newTool);
	}, [game]);

	return (
		<Paper sx={styles.container}>
			<BottomBarButton label="digTunnel" icon={testIcon} active={selectedTool === Tool.DigTunnel}
							 onclick={() => setTool(Tool.DigTunnel)}/>
			<BottomBarButton label="upgradeTunnel" icon={testIcon} active={selectedTool === Tool.UpgradeTunnel}
							 onclick={() => setTool(Tool.UpgradeTunnel)}/>
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