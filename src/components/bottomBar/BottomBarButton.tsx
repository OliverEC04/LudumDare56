import {Button, SxProps} from '@mui/material';
import {FC} from 'react';

interface Props {
	label: string;
	icon: string;
}

export const BottomBarButton: FC<Props> = (props) => {
	const {label, icon} = props;

	return (
		<Button sx={styles.button} aria-label={label}>
			<img src={icon} alt={label} style={{display: 'inline-block'}}/>
		</Button>
	);
};

const styles: { [key: string]: SxProps } = {
	button: {
		width: 80,
		height: 80,
		display: 'flex',
		padding: 1,
	},
};