import {Attacker, Coordinate} from "../../utils/destiny/types";
import {Circle, Group, Image, Rect} from "react-konva";
import useImage from "use-image";
import {default as Modules} from "../../static/modules.js";
import {useCallback, useState} from "react";
import Konva from "konva";
import KonvaEventObject = Konva.KonvaEventObject;

const AttackerOnCanvas = (props: {
	ship: Attacker;
	modShip: (ship: Attacker) => void;
}) => {
	const [image] = useImage(`/img/bs.png`);
	const [dragPos, setDragPos] = useState<Coordinate>(new Coordinate());

	const dragEndHook = useCallback(
		(e: KonvaEventObject<DragEvent>) => {
			props.modShip(
				props.ship.copyWithCoordinates(
					props.ship.coordinate.x - (dragPos.x - e.target.x()) * 10.0,
					props.ship.coordinate.y - (dragPos.y - e.target.y()) * 10.0,
				),
			);
		},
		[props, dragPos],
	);

	const dragStartHook = useCallback(
		(e: KonvaEventObject<DragEvent>) => {
			setDragPos(new Coordinate(e.target.x(), e.target.y()));
		},
		[setDragPos],
	);

	return (
		<Group
			draggable
			onDragEnd={dragEndHook}
			onDragStart={dragStartHook}
			x={props.ship.coordinate.x / 10.0}
			y={props.ship.coordinate.y / 10.0}
			scaleX={0.1}
			scaleY={0.1}
			rotation={45}
		>
			<Image
				offsetX={(image?.width || 0) / 2}
				offsetY={(image?.height || 0) / 2}
				image={image}
				ref={(node) => {
					node?.cache();
					node?.filters([Konva.Filters.RGB]);
					node?.blue(150);
					node?.green(150);
					node?.red(255);
				}}
				alt={`attacker(d${props.ship.destinyLevel})`}
			/>
			<Circle radius={30} fill="black"></Circle>
			<Circle
				radius={Modules["Destiny"]["EffectRadius"]}
				fill={"black"}
				opacity={0.2}
			/>
		</Group>
	);
};

export default AttackerOnCanvas;
