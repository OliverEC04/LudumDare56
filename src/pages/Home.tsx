import {Box, Button, SxProps, TextField} from '@mui/material';
import {useAppDispatch, useAppSelector} from '../state/hooks.ts';
import {decrement, increment, setValue} from '../state/features/counter/counterSlice.ts';

export const Home = () => {
	const dispatch = useAppDispatch();
	const {value} = useAppSelector((state) => state.counter);

	return (
		<Box sx={styles.container}>
			<Button
				variant="contained"
				onClick={() => {
					dispatch(decrement());
				}}>-</Button>
			<TextField
				variant="filled"
				value={value}
				type="number"
				label="Just some counter bitch 👺"
				onChange={(e) => {
					dispatch(setValue(+e.target.value));
				}}/>
			<Button
				variant="contained"
				onClick={() => {
					dispatch(increment());
				}}>+</Button>
		</Box>
	);
};

const styles: { [key: string]: SxProps } = {
	container: {
		display: 'flex',
		padding: 2,
		gap: 2,
		justifyContent: 'center'
	}
};