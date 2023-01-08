import {ChangeEvent, FC, useCallback, useEffect, useMemo, useState} from "react";
import {
    Card,
    CardContent,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack, TextField,
    Typography
} from "@mui/material";
import {getArtCapacity} from "../../utils/trade";
import {ChainProps, HUsageProps} from "./index";
import SummaryBox from "./SummaryBox";

const TradeBox: FC<ChainProps> = (props: {
    prevLevel: number,
    prevNr: number,
    hUsageProps: HUsageProps,
    lvlCb: (lvl: number) => void,
    nrCb: (nr: number) => void,
    tripCb: (tripCount: number) => void
}) => {
    const [rate, setRate] = useState<number>(1.2)
    const [level, setLvl] = useState<number>(7)
    const nr = useMemo(() => {
        let validRate = rate
        if(rate < 1 && props.prevLevel > level) {
            validRate = 1/rate
        }
        if(rate > 1 && props.prevLevel < level) {
            validRate = 1/rate
        }
        const n = validRate * props.prevNr
        props.nrCb(n)
        return n
    }, [props, rate, level])

    const handleLevelChange = useCallback((event: SelectChangeEvent) => {
        const level = event.target.value as unknown as number
        setLvl(level);
        props.lvlCb(level);
    }, [props]);

    const handleRateChange = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const level = event.target.value as unknown as number
        setRate(level);
    }, []);
    useEffect(() => {
        props.tripCb(Math.ceil(nr/getArtCapacity(level, props.hUsageProps.tsLevel, props.hUsageProps.cbeLevel)))
    }, [props, nr, level])

    return (
        <Card>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    Trade settings
                </Typography>
                <Stack sx={{ flexDirection: { xs: "column", md: "row"} }} alignItems="left">
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
                                value={rate}
                                label="Rate"
                                type="number"
                                onChange={handleRateChange}
                            ></TextField>
                        </FormControl>
                    </Stack>
                    <SummaryBox level={level} hUsageProps={props.hUsageProps} nr={nr}/>
                </Stack>
            </CardContent>
        </Card>
    )
}

export default TradeBox