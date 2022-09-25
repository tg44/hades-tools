import {NextPage} from "next";
import ModuleIconSet from "../components/ModuleIconSet";
import {basicCalc, getDroprateToTier, getModuleInfo, getSiblings, ModuleArtifactInfo} from "../utils/artifacts";
import {ChangeEvent, useCallback, useMemo, useState} from "react";
import {
    CardHeader,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack, TextField,
    Typography
} from "@mui/material";
import {secondsToStr} from "../utils/helpers";


const Row = (props: {module: ModuleArtifactInfo, bps: number, targetBps: number, setBps: (bps: number) => void, setTargetBps: (bps: number) => void}) => {

    const handleBpsChange = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const level = event.target.value as unknown as number
        props.setBps(level);
    }, [props]);

    const handleTargetBpsChange = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const level = event.target.value as unknown as number
        props.setTargetBps(level);
    }, [props]);


    return (
        <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={2}>
            <CardHeader title={props.module.name} subheader={`currentMaxLvl: ${props.module.milestones.findIndex(m => m > props.bps)}, targetMaxLvl: ${props.module.milestones.findIndex(m => m > props.targetBps) === -1 ? 12 : props.module.milestones.findIndex(m => m > props.targetBps)}`} />
            <FormControl>
                <TextField
                    value={props.bps}
                    label="Current BPS"
                    type="number"
                    onChange={handleBpsChange}
                ></TextField>
            </FormControl>
            <FormControl>
                <TextField
                    value={props.targetBps}
                    label="Target BPS"
                    type="number"
                    onChange={handleTargetBpsChange}
                ></TextField>
            </FormControl>
        </Stack>
    )
}

const Home: NextPage = () => {
    const [selected, setSelected] = useState<ModuleArtifactInfo | undefined>()
    const [level, setLvl] = useState<number>(4)
    const [bonus, setBonus] = useState<number>(0)
    const [bps, setBps] = useState<number>(0)
    const [targetBps, setTargetBps] = useState<number>(0)
    const mods = useMemo(() => {return getModuleInfo().sort((a, b) => a.TID.localeCompare(b.TID))}, [])
    const siblings = useMemo(() => {
        if(!selected) {
            return []
        }
        return getSiblings(selected.name)
    }, [selected])

    const handleLevelChange = useCallback((event: SelectChangeEvent) => {
        const level = event.target.value as unknown as number
        setLvl(level);
    }, []);

    const handleBonusChange = useCallback((event: SelectChangeEvent) => {
        const bonus = event.target.value as unknown as number
        setBonus(bonus);
    }, []);

    const handleModuleChange = useCallback((m: ModuleArtifactInfo) => {
        setSelected(m)
        if(m.tier+4 > level){
            setLvl(Math.max(m.tier+2, 4));
        }
    }, [level, setLvl, setSelected]);

    return (
        <Grid container spacing={2}>
            <Grid item>
            <ModuleIconSet mods={mods} selected={selected} setSelected={handleModuleChange}/>
            </Grid>
            <Grid item xs={6} style={{marginTop: '12px'}}>
                <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={2}>
                    <FormControl fullWidth>
                        <InputLabel>Artifact Lvl</InputLabel>
                        <Select
                            value={level.toString()}
                            label="Level"
                            onChange={handleLevelChange}
                            fullWidth
                        >
                            {Array.from(Array(12-Math.max((selected?.tier ?? 0)+2, 4)).keys()).map(l => l+Math.max((selected?.tier ?? 0)+2, 4)).map(l => (<MenuItem key={l} value={l}>{l}</MenuItem>))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel>Bonus</InputLabel>
                        <Select
                            value={bonus.toString()}
                            label="Level"
                            onChange={handleBonusChange}
                            fullWidth
                        >
                            {Array.from(Array(21).keys()).map(l => (<MenuItem key={l} value={l}>{`${l}%`}</MenuItem>))}
                        </Select>
                    </FormControl>
                </Stack>
                {selected && <>
                    <p>Selected mod: {selected.name}</p>
                    <p>Selected mod tier: {selected.tier + 2}</p>
                    <p>Selected mod siblings: {siblings.map(m => m.name).join(", ")}</p>
                    <p>{(() => {
                        const drops = getDroprateToTier(selected.name, level)?.drop ?? [0,0]
                        return `Drops per artifact; ${drops[0]}(+${drops[0]*bonus/100})-${drops[1]}(+${drops[1]*bonus/100})`
                    })()}</p>
                    <p>
                        {(() => {
                            const d = getDroprateToTier(selected.name, level)
                            if(!d){
                                return ""
                            }
                            const drops = d.drop ?? [0,0]
                            const basicOut = basicCalc({current: bps, target: targetBps}, [drops[0]*(1+bonus/100), drops[1]*(1+bonus/100)], siblings.length)
                            return `Artifact (and time) need; ${Math.ceil(basicOut.worstCase)} (${secondsToStr(basicOut.worstCase * d.researchTime)}) - ${Math.ceil(basicOut.bestCase)} (${secondsToStr(basicOut.bestCase * d.researchTime)})`
                        })()}
                    </p>
                    <Row key={selected.name} module={selected} bps={bps} targetBps={targetBps} setBps={setBps} setTargetBps={setTargetBps}/>
                </>}
                {/*!!siblings.length && siblings.map(s => <Row key={s.name} module={s} bps={0} targetBps={0} setBps={() => {}} setTargetBps={() => {}}/>)*/}

            </Grid>
        </Grid>
    );
}

export default Home