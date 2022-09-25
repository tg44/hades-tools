import {fullHpByBsLevel, fullHpByTypeAndLevel, Ship} from "../../utils/destiny/types";
import BsRow from "./BsRow";
import {
    CardHeader,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent, Stack,
    TextField, Typography
} from "@mui/material";
import {ChangeEvent, useCallback, useState} from "react";


const WithIdAndLevel = (props: {ship: Ship, modShip: (ship: Ship) => void}) => {
    const [lvl, setLvl] = useState<number>(1);

    const handleIdChange = useCallback((event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const id = event.target.value
        props.modShip(new Ship(id, props.ship.type, props.ship.hullHp, props.ship.personalShieldHp, props.ship.blastShieldHp, props.ship.areaShieldLevel, props.ship.areaShieldHp, props.ship.coordinate))
    }, [props]);

    const handleLevelChange = useCallback((event: SelectChangeEvent) => {
        const level = event.target.value as unknown as number
        setLvl(level);

        props.modShip(new Ship(props.ship.id, props.ship.type, fullHpByTypeAndLevel(props.ship.type, level), props.ship.personalShieldHp, props.ship.blastShieldHp, props.ship.areaShieldLevel, props.ship.areaShieldHp, props.ship.coordinate))
    }, [props]);

    return (<Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={2}>
        <CardHeader title={props.ship.type} subheader={`x: ${props.ship.coordinate.x} y: ${props.ship.coordinate.y}`} />
        {props.ship.chanceOfDeath !== null && <Typography variant="body1">Chance of death: {Math.round(props.ship.chanceOfDeath*10000)/100}%</Typography>}
            <FormControl>
                <TextField
                    value={props.ship.id}
                    label="Id"
                    onChange={handleIdChange}
                ></TextField>
            </FormControl>
            <FormControl>
                <InputLabel>Lvl</InputLabel>
                <Select
                    value={lvl.toString()}
                    label="Level"
                    onChange={handleLevelChange}
                >
                    {Array.from(Array(12).keys()).map(l => l+1).map(l => (<MenuItem key={l} value={l}>{l}</MenuItem>))}
                </Select>
            </FormControl>
    </Stack>)
}

const ShipRow = (props: {ship: Ship, modShip: (ship: Ship) => void}) => {
    return (
        <>
            {props.ship.type === "bs" ? <BsRow ship={props.ship} modShip={props.modShip}/> : <WithIdAndLevel ship={props.ship} modShip={props.modShip}/>}
        </>
    )
}

export default ShipRow;