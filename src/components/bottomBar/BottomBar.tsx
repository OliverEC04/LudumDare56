import {Box, Paper, SxProps} from '@mui/material';
import {BottomBarButton} from './BottomBarButton.tsx';
import testIcon from '../../assets/testIcon.png';
import {Game, Tool} from '../../logic/game.ts';
import {FC, useCallback, useEffect, useState} from 'react';
import {BottomBarMenu} from './BottomBarMenu.tsx';
import {IconSlider} from '../slider/IconSlider.tsx';

interface Props {
	game: Game;
}

export const BottomBar: FC<Props> = (props) => {
	const {game} = props;

	const [selectedTool, setSelectedTool] = useState<Tool>(Tool.None);
	const [showRatio, setShowRatio] = useState<boolean>(false);
	const [scoutRatio, setScoutRatio] = useState(Math.round(game.scoutRatio * 100));
	const [foragerRatio, setForagerRatio] = useState(Math.round(game.foragerRatio * 100));
	const [tunnelerRatio, setTunnelerRatio] = useState(Math.round(game.tunnelerRatio * 100));

	useEffect(() => {
		game.scoutRatio = scoutRatio / 100;
	}, [game, scoutRatio]);

	useEffect(() => {
		game.foragerRatio = foragerRatio / 100;
	}, [game, foragerRatio]);

	useEffect(() => {
		game.tunnelerRatio = tunnelerRatio / 100;
	}, [game, tunnelerRatio]);

	const setTool = useCallback((tool: Tool) => {
		const newTool = game.selectedTool === tool ? Tool.None : tool;
		setSelectedTool(newTool);
		game.selectTool(newTool);
	}, [game]);

	return (
		<Box sx={styles.container}>
			<BottomBarMenu title={'Termite ratio'} show={showRatio}>
				<IconSlider value={scoutRatio} setValue={setScoutRatio} text="Scout" icon={testIcon}/>
				<IconSlider value={foragerRatio} setValue={setForagerRatio} text="Forager" icon={testIcon}/>
				<IconSlider value={tunnelerRatio} setValue={setTunnelerRatio} text="Tunneler" icon={testIcon}/>
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