import {BrowserRouter} from 'react-router-dom';
import {Router} from './navigation/Router.tsx';
import {store} from './state/store.ts';
import {Provider} from 'react-redux';

export const App = () => {
	return (
		<Provider store={store}>
			<BrowserRouter>
				<Router/>
			</BrowserRouter>
		</Provider>
	);
};
