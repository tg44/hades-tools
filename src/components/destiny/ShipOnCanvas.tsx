import {Coordinate, Ship} from "../../utils/destiny/types";
import {Circle, Group, Image} from "react-konva";
import useImage from "use-image";
import {default as Modules} from "../../static/modules.js"
import {useCallback, useState} from "react";
import Konva from "konva";
import KonvaEventObject = Konva.KonvaEventObject;

const ShipOnCanvas = (props: {ship: Ship, modShip: (ship: Ship) => void}) => {
    const [image] = useImage(`/img/${props.ship.type || 'bs'}.png`);
    const [dragPos, setDragPos] = useState<Coordinate>(new Coordinate())

    const dragEndHook = useCallback( (e: KonvaEventObject<DragEvent>) => {
        props.modShip(
            props.ship.copyWithCoordinates(
                props.ship.coordinate.x - (dragPos.x - e.target.x())*10.0,
                props.ship.coordinate.y - (dragPos.y - e.target.y())*10.0,
            )
        )
        }, [props, dragPos]
    )

    const dragStartHook = useCallback( (e: KonvaEventObject<DragEvent>) => {
        setDragPos(new Coordinate(e.target.x(), e.target.y()))
        }, [setDragPos]
    )

    return (
    <Group
        draggable
        onDragEnd={dragEndHook}
        onDragStart={dragStartHook}
        x={props.ship.coordinate.x/10.0}
        y={props.ship.coordinate.y/10.0}
        scaleX={0.1}
        scaleY={0.1}
        rotation={45}
    >
        <Group
            scaleX={props.ship.type === 'relicDrone' ? 3 : 1}
            scaleY={props.ship.type === 'relicDrone' ? 3 : 1}
            >
            <Image
                offsetX={(image?.width || 0)/2}
                offsetY={(image?.height || 0)/2}
                image={image}
                ref={(node) => {
                    node?.cache();
                    node?.filters([Konva.Filters.RGB])
                    node?.blue(150)
                    node?.green(255)
                    node?.red(150)
                }}
            />
        </Group>
        <Circle
            radius={30}
            fill="black"
            ></Circle>
        {props.ship.blastShieldHp > 0 && <Circle
            radius={Modules["BlastShield"]["EffectRadius"]}
            stroke={'red'}
            strokeWidth={5}
        />}
        {props.ship.areaShieldHp > 0 && <Circle
            radius={Modules["AreaShield"]["EffectRadiusWS"][props.ship.areaShieldLevel || 0]}
            stroke={'blue'}
            strokeWidth={5}
        />}
    </Group>
    )

}

export default ShipOnCanvas
