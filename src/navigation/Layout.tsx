import {Box} from '@mui/material';
import {Outlet} from 'react-router-dom';

export const Layout = () => {
	return (
		<Box sx={{flexGrow: 1}}>
			<Outlet/>
		</Box>
	);
};