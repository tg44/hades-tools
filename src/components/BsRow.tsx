import {
    CardHeader,
    FormControl,
    InputLabel,
    ListItem,
    ListItemButton,
    ListItemText,
    MenuItem,
    Select,
    SelectChangeEvent, Stack, TextField, Typography
} from "@mui/material";
import {areaShieldHp, blastShieldHp, fullHpByBsLevel, Ship} from "../utils/types";
import {ChangeEvent, useCallback, useState} from "react";

type Shields = "personal" | "area" | "blast"

const Bs = (props: {ship: Ship, modShip: (ship: Ship) => void}) => {
    const [shield, setShield] = useState<Shields>("personal");
    const [shieldLvl, setShieldLvl] = useState<number>(1);
    const [lvl, setLvl] = useState<number>(1);

    const handleShieldChange = useCallback((event: SelectChangeEvent) => {
        const newShield = event.target.value as string as Shields
        if(newShield !== shield) {
            if(newShield === "personal") {
                props.modShip(new Ship(props.ship.id, "bs", props.ship.hullHp, props.ship.personalShieldHp, 0, 0, 0, props.ship.coordinate))
            }
            if(newShield === "area") {
                props.modShip(new Ship(props.ship.id, "bs", props.ship.hullHp, 0, 0, shieldLvl, areaShieldHp(shieldLvl), props.ship.coordinate))
            }
            if(newShield === "blast") {
                props.modShip(new Ship(props.ship.id, "bs", props.ship.hullHp, 0, blastShieldHp(shieldLvl), 0, 0, props.ship.coordinate))
            }
        }
        setShield(newShield);
    }, [props, shield, shieldLvl]);

    const handleShieldLevelChange = useCallback((event: SelectChangeEvent) => {
        const newShieldLevel = event.target.value as unknown as number
        if(newShieldLevel !== shieldLvl) {
            if(shield === "personal") {
                props.modShip(new Ship(props.ship.id, "bs", props.ship.hullHp, props.ship.personalShieldHp, 0, 0, 0, props.ship.coordinate))
            }
            if(shield === "area") {
                props.modShip(new Ship(props.ship.id, "bs", props.ship.hullHp, 0, 0, newShieldLevel, areaShieldHp(newShieldLevel), props.ship.coordinate))
            }
            if(shield === "blast") {
                props.modShip(new Ship(props.ship.id, "bs", props.ship.hullHp, 0, blastShieldHp(newShieldLevel), 0, 0, props.ship.coordinate))
            }
        }
        setShieldLvl(newShieldLevel);
    }, [props, shield, shieldLvl]);

    const handleShieldHpChange = useCallback((event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const shp = event.target.value as unknown as number
        if(shield === "personal") {
            props.modShip(new Ship(props.ship.id, "bs", props.ship.hullHp, shp, 0, 0, 0, props.ship.coordinate))
        }
        if(shield === "area") {
            props.modShip(new Ship(props.ship.id, "bs", props.ship.hullHp, 0, 0, props.ship.areaShieldLevel, shp, props.ship.coordinate))
        }
        if(shield === "blast") {
            props.modShip(new Ship(props.ship.id, "bs", props.ship.hullHp, 0, shp, 0, 0, props.ship.coordinate))
        }
    }, [props, shield]);

    const handleLevelChange = useCallback((event: SelectChangeEvent) => {
        const level = event.target.value as unknown as number
        setLvl(level);

        props.modShip(new Ship(props.ship.id, "bs", fullHpByBsLevel(level), props.ship.personalShieldHp, props.ship.blastShieldHp, props.ship.areaShieldLevel, props.ship.areaShieldHp, props.ship.coordinate))
    }, [props]);

    const handleHpChange = useCallback((event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const hp = (event.target.value as unknown as number);

        props.modShip(new Ship(props.ship.id, "bs", hp, props.ship.personalShieldHp, props.ship.blastShieldHp, props.ship.areaShieldLevel, props.ship.areaShieldHp, props.ship.coordinate))
    }, [props]);

    const handleIdChange = useCallback((event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const id = event.target.value
        props.modShip(new Ship(id, "bs", props.ship.hullHp, props.ship.personalShieldHp, props.ship.blastShieldHp, props.ship.areaShieldLevel, props.ship.areaShieldHp, props.ship.coordinate))
    }, [props]);

    return (
        <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={2}>
            <CardHeader title={`BS`} subheader={`x: ${props.ship.coordinate.x} y: ${props.ship.coordinate.y}`} />
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
                    {Array.from(Array(6).keys()).map(l => l+1).map(l => (<MenuItem key={l} value={l}>{l}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <TextField
                    value={props.ship.hullHp}
                    label="Hp"
                    type={"number"}
                    onChange={handleHpChange}
                ></TextField>
            </FormControl>
            <FormControl>
                <InputLabel>Shield</InputLabel>
                <Select
                    value={shield}
                    label="Shield"
                    onChange={handleShieldChange}
                >
                    <MenuItem value={"personal"}>Personal</MenuItem>
                    <MenuItem value={"area"}>Area</MenuItem>
                    <MenuItem value={"blast"}>Blast</MenuItem>
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>ShieldLvl</InputLabel>
                <Select
                    value={shieldLvl.toString()}
                    label="ShieldLvl"
                    onChange={handleShieldLevelChange}
                >
                    {Array.from(Array(12).keys()).map(l => l+1).map(l => (<MenuItem key={l} value={l}>{l}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <TextField
                    value={props.ship.areaShieldHp || props.ship.personalShieldHp || props.ship.blastShieldHp}
                    label="ShieldHp"
                    type={"number"}
                    onChange={handleShieldHpChange}
                ></TextField>
            </FormControl>
        </Stack>
    )
}







export default Bs;

