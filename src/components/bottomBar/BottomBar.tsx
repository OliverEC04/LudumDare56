import {Paper, SxProps} from '@mui/material';
import {BottomBarButton} from './BottomBarButton.tsx';
import testIcon from '../../assets/testIcon.png';

export const BottomBar = () => {
	return (
		<Paper sx={styles.container}>
			<BottomBarButton label="btn1" icon={testIcon}/>
			<BottomBarButton label="btn2" icon={testIcon}/>
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