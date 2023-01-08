import {Attacker, fullHpByTypeAndLevel, Ship} from "../../utils/destiny/types";
import {useCallback} from "react";
import {
	CardHeader,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	Stack,
} from "@mui/material";

const AttackerRow = (props: {
	ship: Attacker;
	modShip: (ship: Attacker) => void;
}) => {
	const handleLevelChange = useCallback(
		(event: SelectChangeEvent) => {
			const level = event.target.value as unknown as number;

			props.modShip(new Attacker(level, props.ship.coordinate));
		},
		[props],
	);

	return (
		<Stack
			direction="row"
			justifyContent="flex-start"
			alignItems="center"
			spacing={2}
		>
			<CardHeader
				title={"Attacker"}
				subheader={`x: ${props.ship.coordinate.x} y: ${props.ship.coordinate.y}`}
			/>
			<FormControl>
				<InputLabel>Destiny level</InputLabel>
				<Select
					value={props.ship.destinyLevel.toString()}
					label="Destiny level"
					onChange={handleLevelChange}
				>
					{Array.from(Array(12).keys())
						.map((l) => l + 1)
						.map((l) => (
							<MenuItem key={l} value={l}>
								{l}
							</MenuItem>
						))}
				</Select>
			</FormControl>
		</Stack>
	);
};

export default AttackerRow;
