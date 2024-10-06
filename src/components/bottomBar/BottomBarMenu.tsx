import {FC, ReactNode} from 'react';
import {Box, Paper, SxProps} from '@mui/material';

interface Props {
	children: ReactNode[];
	title?: string;
	show?: boolean;
}

export const BottomBarMenu: FC<Props> = (props) => {
	const {children, title, show} = props;

	return (
		// hidden prop doesnt work
		<Paper sx={{...styles.container, display: show ? 'flex' : 'none'} as SxProps} hidden={!show}>
			{title ? (<Box component="h3" sx={styles.title}>{title}</Box>) : ''}
			<Box sx={styles.sliderContainer}>{children}</Box>

		</Paper>);
};

const styles: { [key: string]: SxProps } = {
	container: {
		display: 'flex',
		flexDirection: 'column',
		backgroundColor: '#f0f0f040',
		color: '#ffffffe0',
		marginY: 1,
		padding: 4,
		justifyContent: 'center',
	},
	sliderContainer: {
		display: 'flex',
		justifyContent: 'center',
		gap: 1,
	},
	title: {},
};