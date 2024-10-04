import {Box, Button, SxProps} from '@mui/material';
import {Link} from 'react-router-dom';
import {FC, ReactNode} from 'react';
import {useAppDispatch} from '../../state/hooks.ts';
import {setSideMenuOpen} from '../../state/features/layout/layoutSlice.ts';

export type MenuButtonProps = {
	to: string;
	label: string;
	icon: ReactNode;
	sx?: SxProps;
}

export const MenuButton: FC<MenuButtonProps> = (props) => {
	const {to, label, icon, sx} = props;

	const dispatch = useAppDispatch();

	return (
		<Link to={to}>
			<Button
				onClick={() => {
					dispatch(setSideMenuOpen(false));
				}}
				sx={{...styles.button, ...sx} as SxProps}
			>
				<Box>{icon}</Box>
				<Box>{label}</Box>
			</Button>
		</Link>
	);
};

const styles: { [key: string]: SxProps } = {
	button: {
		display: 'grid',
		gridTemplateColumns: '50px 1fr',
		width: 300,
		height: 50,
		padding: 1,
		borderRadius: 2
	}
};