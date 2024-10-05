import {BrowserRouter} from 'react-router-dom';
import {Router} from './navigation/Router.tsx';

export const App = () => {
	return (
		<BrowserRouter>
			<Router/>
		</BrowserRouter>
	);
};
