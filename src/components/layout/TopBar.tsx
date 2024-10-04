import {AppBar, IconButton, Toolbar, Typography} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {useAppDispatch} from '../../state/hooks.ts';
import {toggleSideMenuOpen} from '../../state/features/layout/layoutSlice.ts';

export const TopBar = () => {
	const dispatch = useAppDispatch();

	return (
		<AppBar position="static">
			<Toolbar>
				<IconButton
					size="large"
					edge="start"
					color="inherit"
					aria-label="menu"
					onClick={() => dispatch(toggleSideMenuOpen())}
					sx={{mr: 2}}
				>
					<MenuIcon/>
				</IconButton>
				<Typography variant="h6" component="div" sx={{flexGrow: 1}}>
					News 💀
				</Typography>
			</Toolbar>
		</AppBar>);
};