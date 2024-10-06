import {Box, Paper, SxProps} from '@mui/material';
import {BottomBarButton} from './BottomBarButton.tsx';
import testIcon from '../../assets/testIcon.png';
import {Game, Tool} from '../../logic/game.ts';
import {FC, useCallback, useState} from 'react';
import {BottomBarMenu} from './BottomBarMenu.tsx';
import {IconSlider} from '../slider/IconSlider.tsx';

interface Props {
	game: Game;
}

export const BottomBar: FC<Props> = (props) => {
	const {game} = props;

	const [selectedTool, setSelectedTool] = useState<Tool>(Tool.None);
	const [showRatio, setShowRatio] = useState<boolean>(false);
	const [val, setVal] = useState(0);

	const setTool = useCallback((tool: Tool) => {
		const newTool = game.selectedTool === tool ? Tool.None : tool;
		setSelectedTool(newTool);
		game.selectTool(newTool);
	}, [game]);

	return (
		<Box sx={styles.container}>
			<BottomBarMenu show={showRatio}>
				<IconSlider value={val} setValue={setVal} text="Termite" icon={testIcon}/>
				<IconSlider value={val} setValue={setVal}/>
			</BottomBarMenu>
			<Paper sx={styles.bar}>
				<BottomBarButton label="digTunnel" icon={testIcon} active={selectedTool === Tool.DigTunnel}
								 onclick={() => setTool(Tool.DigTunnel)}/>
				<BottomBarButton label="upgradeTunnel" icon={testIcon} active={selectedTool === Tool.UpgradeTunnel}
								 onclick={() => setTool(Tool.UpgradeTunnel)}/>
				<BottomBarButton label="termiteRatio" icon={testIcon} active={showRatio}
								 onclick={() => setShowRatio(!showRatio)}/>
			</Paper>
		</Box>
	);
};

const styles: { [key: string]: SxProps } = {
	container: {
		position: 'absolute',
		bottom: 0,
		color: '#ffffffe0',
	},
	bar: {
		display: 'flex',
		backgroundColor: '#f0f0f040',
		gap: 1,
		padding: 1,
	},
};