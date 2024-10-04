import {Drawer} from '@mui/material';
import {useAppDispatch, useAppSelector} from '../../state/hooks.ts';
import {setSideMenuOpen} from '../../state/features/layout/layoutSlice.ts';
import {routes} from '../../navigation/appRoutes.ts';
import {MenuButton} from './MenuButton.tsx';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';

export const SideMenu = () => {
	const dispatch = useAppDispatch();
	const {sideMenuOpen} = useAppSelector((state) => state.layout);

	return (
		<Drawer
			open={sideMenuOpen}
			onClose={() => {
				dispatch(setSideMenuOpen(false));
			}}
			sx={{display: 'flex', gap: 2}}>
			<MenuButton to={routes.home} label="Home" icon={<HomeIcon/>}/>
			<MenuButton to={routes.about} label="About" icon={<InfoIcon/>}/>
		</Drawer>);
};
