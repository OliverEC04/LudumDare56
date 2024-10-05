import {Box, Button, SxProps} from '@mui/material';
import {FC} from 'react';

interface Props {
	label: string;
	icon: string;
	active?: boolean;

	onclick(): void;
}

export const BottomBarButton: FC<Props> = (props) => {
	const {label, icon, active = false, onclick} = props;

	return (
		<Button sx={{...styles.button, backgroundColor: active ? '#f0f0f040' : 'none'} as SxProps} aria-label={label}
				onClick={onclick}>
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