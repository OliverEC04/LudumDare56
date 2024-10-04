import {Box} from '@mui/material';
import {Outlet} from 'react-router-dom';
import {TopBar} from '../components/layout/TopBar.tsx';
import {SideMenu} from '../components/layout/SideMenu.tsx';

export const Layout = () => {
	return (
		<Box sx={{flexGrow: 1}}>
			<TopBar/>
			<SideMenu/>
			<Outlet/>
		</Box>
	);
};