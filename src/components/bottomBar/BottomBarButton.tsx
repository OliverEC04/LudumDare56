import {Button} from '@mui/material';
import {FC} from 'react';

interface Props {
	label: string;
}

export const BottomBarButton: FC<Props> = (props) => {
	const {label} = props;

	return (
		<Button>
			{label}
		</Button>
	);
};