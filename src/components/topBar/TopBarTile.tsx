import {Box} from '@mui/material';

interface Props<T> {
	label: string;
	value: T;
}

export const TopBarTile = <T, >({label, value}: Props<T>) => {
	return (
		<Box>{label}: {value as string}</Box>
	);
};