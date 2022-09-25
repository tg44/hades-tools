import {Circle, Layer, Line, Rect, Stage, Text, Image, Group} from "react-konva";
import useImage from 'use-image';
import ShipOnCanvas from "./ShipOnCanvas";
import {
    Attacker, Coordinate,
    createFullAreaShield,
    createFullBlastShield,
    createMiner,
    createRelicDrone,
    createTransport, fullHpByBsLevel, Ship
} from "../../utils/destiny/types";
import AttackerOnCanvas from "./AttackerOnCanvas";
import {useCallback, useEffect, useState} from "react";
import {
    Button, IconButton,
    List,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import { styled } from '@mui/material/styles';
import Konva from "konva";
import KonvaEventObject = Konva.KonvaEventObject;
import BsRow from "./BsRow";
import ShipRow from "./ShipRow";
import AttackerRow from "./AttackerRow";
import {aggregateOutput, chanceToDie, destinyCover, isInCover, solveSingleAttacker} from "../../utils/destiny/mechanics";
import DeleteIcon from '@mui/icons-material/Delete';

export const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    justifyContent: 'space-between',
    flexDirection: 'row',
    display: 'flex',
}));

const Canvas = () => {
    const [ships, setShips] = useState<Ship[]>([])
    const [attackers, setAttackers] = useState<Attacker[]>([])
    const [mouseCoords, setMouseCoords] = useState<Coordinate>(new Coordinate(0,0))

    const addShip = useCallback((s: Ship) => {
        setShips(prevState => {
            return [...prevState, s].sort((a, b) => (b.type !== a.type && (a.type === 'bs' || b.type === 'bs')) ? (a.type === 'bs' ? -1 : 1) : 0 )
        })
    }, [setShips])

    const shipMod = useCallback((oldS: Ship) => (newS: Ship) => {
        setShips(prevState => {
            return prevState.map((actualS) => {
                if(actualS === oldS) {
                    return newS
                } else {
                    return actualS
                }
            })
        })
    }, [setShips])

    const attackerMod = useCallback((oldS: Attacker) => (newS: Attacker) => {
        setAttackers(prevState => {
            return prevState.map((actualS) => {
                if(actualS === oldS) {
                    return newS
                } else {
                    return actualS
                }
            })
        })
    }, [setAttackers])

    const removeShip = useCallback((oldS: Ship) => () => {
        setShips(prevState => {
            return prevState.filter((actualS) => actualS !== oldS)
        })
    }, [setShips])

    const removeAttacker = useCallback((oldS: Attacker) => () => {
        setAttackers(prevState => {
            return prevState.filter((actualS) => actualS !== oldS)
        })
    }, [setAttackers])

    const handleMouseMove = useCallback((e: KonvaEventObject<MouseEvent>) => {
        const stage = e.target.getStage();
        const c = stage?.getPointerPosition()
        setMouseCoords(new Coordinate(c?.x || 0, c?.y || 0))
    }, [setMouseCoords])

    const solve = useCallback(() => {
        if(attackers.length !== 1) {
            alert("You need exactly one attacker!")
        }
        const att = attackers[0]
        const cover = destinyCover(att)
        const ret = chanceToDie(aggregateOutput(solveSingleAttacker(cover, ships)))
        setShips(prevState => {
            return prevState.map((actualS) => {
                return actualS.setChanceOfDeath(ret.find(r => r.id === actualS.id)?.dc || 0.0)
            })
        })
    }, [attackers, ships, setShips])

    return (<>
        <Stack spacing={2}>
            {
                ships.map((s, i) => {
                    return (
                        <Item key={`s-${i}`}>
                            <ShipRow ship={s} modShip={shipMod(s)}/>
                            <IconButton edge="end" aria-label="delete" onClick={removeShip(s)}>
                                <DeleteIcon />
                            </IconButton>
                        </Item>)
                })
            }
            {
                attackers.map((s, i) => {
                    return (
                        <Item key={`a-${i}`}>
                            <AttackerRow ship={s} modShip={attackerMod(s)}/>
                            <IconButton edge="end" aria-label="delete" onClick={removeAttacker(s)}>
                                <DeleteIcon />
                            </IconButton>
                        </Item>)
                })
            }
        </Stack>
        <Button variant="contained" onClick={() => setAttackers(prev => [...prev, new Attacker(4, new Coordinate(2500,2500))])}>Add Attacker</Button>
        <Button variant="contained" onClick={() => addShip(new Ship("bs1", 'bs', fullHpByBsLevel(1), 0, 0, 0, 0, new Coordinate(2500,2500)))}>Add BS</Button>
        <Button variant="contained" onClick={() => addShip(createTransport("t1", new Coordinate(2500,2500)))}>Add TS</Button>
        <Button variant="contained" onClick={() => addShip(createMiner("m1", new Coordinate(2500,2500)))}>Add Miner</Button>
        <Button variant="contained" onClick={() => addShip(createRelicDrone("rd1", new Coordinate(2500,2500)))}>Add Relic drone</Button>
        <p>Mouse; x: {mouseCoords.x} y: {mouseCoords.y}</p>
        <Button variant="contained" color="warning" onClick={() => solve()}>Simulate</Button>
        <Stage width={500} height={500} onMouseMove={handleMouseMove}>
            <Layer>
                {attackers.map((s, i) => {
                    return (<AttackerOnCanvas key={`a-${i}`} ship={s} modShip={attackerMod(s)}></AttackerOnCanvas>)
                })}
                {ships.map((s, i) => {
                    return (<ShipOnCanvas key={`s-${i}`} ship={s} modShip={shipMod(s)}></ShipOnCanvas>)
                })}
            </Layer>
        </Stage>
    </>
    )
}

export default Canvas;