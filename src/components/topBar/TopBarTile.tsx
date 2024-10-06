import {Box} from '@mui/material';

interface Props<T> {
	icon?: string;
	text?: string;
	label: string;
	value: T;
}

export const TopBarTile = <T, >({icon, text, label, value}: Props<T>) => {

	const iconElem = icon && (<Box component="img" src={icon}/>);
	const textElem = text && (<Box>{text}</Box>);

	return (
		<Box>
			{}
		</Box>
	);
};