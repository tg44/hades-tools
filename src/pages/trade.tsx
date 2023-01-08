import {NextPage} from "next";
import Layout, {pages} from "../components/Layout";
import {ChangeEvent, FC, useCallback, useEffect, useMemo, useState} from "react";
import {
    Button, Card, CardActions, CardContent,
    Checkbox,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem, Paper,
    Select,
    SelectChangeEvent,
    Stack,
    TextField, Typography
} from "@mui/material";
import {default as Ships} from "../static/capital_ships.js"
import {default as Modules} from "../static/modules.js"
import {default as Arts} from "../static/artifacts.js"
import {getArtCapacity, getHUsage, getSalvageValues, getTsCapacity} from "../utils/trade";
import ProfitBox from "../components/trade/ProfitBox";
import BoxStack from "../components/trade/BoxStack";
import TradeBox from "../components/trade/TradeBox";
import SummaryBox from "../components/trade/SummaryBox";
import {EmptyHUsageProps, HUsageProps} from "../components/trade";

const Home: NextPage = () => {
    const [level, setLvl] = useState<number>(6)
    const [nr, setNr] = useState<number>(50)

    const [movementCalc, setMovementCalc] = useState<boolean>(false)
    const [tsLvl, setTsLvl] = useState<number>(3)
    const [cbeLvl, setCbeLvl] = useState<number>(3)
    const [distancePerTrip, setDistancePerTrip] = useState<number>(3*200)
    const hUsagePerShipPer100Au = useMemo(() => getHUsage(tsLvl, cbeLvl), [tsLvl, cbeLvl])

    const [boxes, setBoxes] = useState<number>(1)

    const [outLevel, setOutLvl] = useState<number>(7)
    const [outNr, setOutNr] = useState<number>(50)
    const [outTrips, setOutTrips] = useState<number>(0)

    const handleLevelChange = useCallback((event: SelectChangeEvent) => {
        const level = event.target.value as unknown as number
        setLvl(level);
    }, []);

    const handleTsLevelChange = useCallback((event: SelectChangeEvent) => {
        const level = event.target.value as unknown as number
        setTsLvl(level);
    }, []);

    const handleCbeLevelChange = useCallback((event: SelectChangeEvent) => {
        const level = event.target.value as unknown as number
        setCbeLvl(level);
    }, []);

    const handleNrChange = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const level = event.target.value as unknown as number
        setNr(level);
    }, []);

    const handleDistanceChange = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const level = event.target.value as unknown as number
        setDistancePerTrip(level);
    }, []);

    const boxCb = useCallback((diff: number) => {
        setBoxes(v => v+diff)
    }, [setBoxes])

    const hUsageProps = useMemo<HUsageProps>(() => {
        return {
            movementCalc,
            tsLevel: tsLvl,
            cbeLevel: cbeLvl,
            distancePerTrip,
            hUsagePerShipPer100Au,
        }
    }, [movementCalc, tsLvl, cbeLvl, distancePerTrip, hUsagePerShipPer100Au])

    return (
        <Layout pages={pages}>
            <Stack spacing={2} sx={{ flexDirection: { xs: "column", md: "column"} }} alignItems="center">
                <Card>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Initial settings
                        </Typography>
                    <Stack sx={{ flexDirection: { xs: "column", md: "row"} }} alignItems="center">
                        <Stack>
                            <FormControl fullWidth style={{marginTop: '12px'}}>
                                <InputLabel>Artifact Lvl</InputLabel>
                                <Select
                                    value={level.toString()}
                                    label="Relic level"
                                    onChange={handleLevelChange}
                                    fullWidth
                                >
                                    {Array.from({length:11},(v,k)=> k+1)
                                        .map(l => (<MenuItem key={l} value={l}>{l}</MenuItem>))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth style={{marginTop: '12px'}}>
                                <TextField
                                    value={nr}
                                    label="Number of relics"
                                    type="number"
                                    onChange={handleNrChange}
                                ></TextField>
                            </FormControl>
                            <FormControlLabel control={<Checkbox defaultChecked={movementCalc} onChange={(e) => setMovementCalc(e.target.checked)} />} label="Calc movement hydrogens" />
                            {movementCalc &&
                                <FormControl fullWidth style={{marginTop: '12px'}}>
                                    <InputLabel>Ts Lvl</InputLabel>
                                    <Select
                                        value={tsLvl.toString()}
                                        label="Ts level"
                                        onChange={handleTsLevelChange}
                                        fullWidth
                                    >
                                        {Array.from({length: Ships.Transport.JumpFuelCosts.length}, (v, k) => k + 1)
                                            .map(l => (<MenuItem key={l} value={l}>{l}</MenuItem>))}
                                    </Select>
                                </FormControl>
                            }
                            {movementCalc &&
                                <FormControl fullWidth style={{marginTop: '12px'}}>
                                    <InputLabel>Cbe Lvl</InputLabel>
                                    <Select
                                        value={cbeLvl.toString()}
                                        label="Cbe level"
                                        onChange={handleCbeLevelChange}
                                        fullWidth
                                    >
                                        {Array.from({length: Modules.TransportCapacity.UnlockBlueprints.length}, (v, k) => k + 1)
                                            .map(l => (<MenuItem key={l} value={l}>{l}</MenuItem>))}
                                    </Select>
                                </FormControl>
                            }
                            {movementCalc && <FormControl fullWidth style={{marginTop: '12px'}}>
                                    <TextField
                                        value={distancePerTrip}
                                        label="Total distance of one trade"
                                        helperText="3x200 is a good initial value"
                                        type="number"
                                        onChange={handleDistanceChange}
                                    ></TextField>
                                </FormControl>
                            }
                        </Stack>
                        <div>
                            <SummaryBox nr={nr} level={level} hUsageProps={EmptyHUsageProps} />
                            {movementCalc &&
                                <ul>
                                    <li>ts capacity: {getTsCapacity(tsLvl, cbeLvl)}</li>
                                    <li>hUsagePer100Au: {Math.round(hUsagePerShipPer100Au)}</li>
                                </ul>
                            }
                        </div>
                    </Stack>
                    </CardContent>
                    <CardActions>
                        <Button size="small" color="primary" onClick={() => boxCb(1)}> Add Trade step </Button>
                        <Button size="small" color="primary" onClick={() => boxCb(-1)}> Remove Trade step </Button>
                    </CardActions>
                </Card>
                <BoxStack currentDepth={1} maxDepth={boxes} C1={TradeBox} prevNr={nr} prevLevel={level} hUsageProps={hUsageProps} lvlCb={setOutLvl} nrCb={setOutNr} tripCb={setOutTrips}/>
                <Card>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Summary
                        </Typography>
                        <ProfitBox initialLevel={level} endLevel={outLevel} initialNr={nr} endNr={outNr} sumTrips={outTrips} hUsageProps={hUsageProps}></ProfitBox>
                    </CardContent>
                </Card>
            </Stack>
        </Layout>
    )
}

export default Home;