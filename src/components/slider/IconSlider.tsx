import {FC} from 'react';
import {Box, Slider, SxProps} from '@mui/material';

interface Props {
	icon?: string;
	text?: string;
	value: number;

	setValue(value: number): void;
}

export const IconSlider: FC<Props> = (props) => {
	const {icon, text, value, setValue} = props;

	const iconElem = icon && (<Box component="img" src={icon} sx={styles.img}/>);
	const textElem = text && (<Box>{text}</Box>);

	return (
		<Box sx={styles.container}>
			{iconElem ?? ''}
			{textElem ?? ''}
			<Slider value={value} onChange={e => {
				setValue(+(e.target as HTMLInputElement).value);
			}
			} orientation="vertical"
					sx={styles.slider}/>
		</Box>);
};

const styles: { [key: string]: SxProps } = {
	container: {
		display: 'grid',
		gridTemplateRows: '40px 40px auto',
		justifyItems: 'center',
		alignItems: 'center',
		width: '80px',
	},
	slider: {
		gridRow: '3 / 4',
		height: '200px',

		'& input[type="range"]': {
			WebkitAppearance: 'slider-vertical',
		},
	},
	img: {
		height: '100%',
		width: 'auto',
	},
};