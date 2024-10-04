import {configureStore} from '@reduxjs/toolkit';
import layoutReducer from './features/layout/layoutSlice.ts';
import counterReducer from './features/counter/counterSlice.ts';

export const store = configureStore({
	reducer: {
		layout: layoutReducer,
		counter: counterReducer
	},
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch