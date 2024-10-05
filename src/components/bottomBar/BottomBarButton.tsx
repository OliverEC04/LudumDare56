import {Box, Button, SxProps} from '@mui/material';
import {FC} from 'react';

interface Props {
	label: string;
	icon: string;

	onclick(): void;
}

export const BottomBarButton: FC<Props> = (props) => {
	const {label, icon, onclick} = props;

	return (
		<Button sx={styles.button} aria-label={label} onClick={onclick}>
			<Box component="img" src={icon} alt={label} sx={styles.img}/>
		</Button>
	);
};

const styles: { [key: string]: SxProps } = {
	button: {
		width: 80,
		height: 80,
	},
	img: {
		maxWidth: '100%',
		maxHeight: '100%',
	},
};