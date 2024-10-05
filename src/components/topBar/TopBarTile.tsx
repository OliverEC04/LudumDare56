import {Box} from '@mui/material';

interface Props<T> {
	// icon?: string;
	// text?: string;
	label: string;
	value: T;
}

export const TopBarTile = <T, >({label, value}: Props<T>) => {

	// const iconComp = (<Box></Box>);

	return (
		<Box>{label}: {value as string}</Box>
	);
};