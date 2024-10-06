import {Box, SxProps} from '@mui/material';

interface Props<T> {
	icon?: string;
	text?: string;
	label: string;
	value: T;
}

export const TopBarTile = <T, >({icon, text, label, value}: Props<T>) => {

	const iconElem = icon && (<Box component="img" src={icon} sx={styles.img}/>);
	const textElem = text && (<Box>{text}:</Box>);

	return (
		<Box aria-label={label} sx={styles.container}>
			{iconElem ?? ''}
			{textElem ?? ''}
			<Box>{value as string}</Box>
		</Box>
	);
};

const styles: { [key: string]: SxProps } = {
	container: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		gap: 1,
		height: '16px',
	},
	img: {
		height: '100%',
		width: 'auto',
	},
};