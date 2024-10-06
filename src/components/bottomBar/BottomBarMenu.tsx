import {FC, ReactNode} from 'react';
import {Paper, SxProps} from '@mui/material';

interface Props {
	children: ReactNode[];
	show?: boolean;
}

export const BottomBarMenu: FC<Props> = (props) => {
	const {children, show} = props;

	return (
		// hidden prop doesnt work
		<Paper sx={{...styles.container, display: show ? 'flex' : 'none'} as SxProps} hidden={!show}>
			{children}
		</Paper>);
};

const styles: { [key: string]: SxProps } = {
	container: {
		display: 'flex',
		backgroundColor: '#f0f0f040',
		color: '#ffffffe0',
		gap: 1,
		padding: 4,
		marginY: 1,
		justifyContent: 'center',
	},
};