import {default as Modules} from "../static/modules.js"
import {default as Artifacts} from "../static/artifacts.js"
import {ChangeEvent} from "react";
import {minBy, sumBy} from "./helpers";

export interface ModuleArtifactInfo {
    name: string,
    TID: string,
    milestones: number[],
    tier: number,
    icon: string,
    slotType: string,
}

interface Artifact {
    name: string,
    TID: string[],
    timeToResearch: number[],
    drop: Record<string, number[][]>,
}

const getArtifacts = (): Artifact[] => {
    const orbRoot = Artifacts["Combat"]
    const blueRoot = Artifacts["Utility"]
    const tetRoot = Artifacts["Support"]
    const orb = {
        name: orbRoot.Name,
        TID: orbRoot.TID,
        timeToResearch: orbRoot.TimeToResearch,
        drop: Artifacts["CombatBlueprints"]
    }
    const blue = {
        name: blueRoot.Name,
        TID: blueRoot.TID,
        timeToResearch: blueRoot.TimeToResearch,
        drop: Artifacts["UtilityBlueprints"]
    }
    const tet = {
        name: tetRoot.Name,
        TID: tetRoot.TID,
        timeToResearch: tetRoot.TimeToResearch,
        drop: Artifacts["SupportBlueprints"]
    }
    const arr = [orb, blue, tet]
    arr.forEach(e => {
        //@ts-ignore
        delete e.drop.Name
        //@ts-ignore
        delete e.drop["2"]
    })
    return arr as unknown as Artifact[];
}

export const getModuleInfo = () => {
    return Object.keys(Modules).map( (m)=> {
        const mod = Modules[m as keyof typeof Modules]
        if('TID_Artifact' in mod && 'UnlockBlueprints' in mod && 'AwardLevel' in mod && 'Icon' in mod) {
            return {
                name: m,
                TID: mod.TID_Artifact,
                milestones: Array.isArray(mod.UnlockBlueprints) ? mod.UnlockBlueprints : [mod.UnlockBlueprints ?? 1],
                tier: mod.AwardLevel,
                icon: mod.Icon,
                slotType: mod.SlotType,
            } as ModuleArtifactInfo
        } else return null
    }).filter((m): m is ModuleArtifactInfo => !!m)
}

export const getSiblings = (name: string) => {
    const mods = getModuleInfo()
    const f = mods.find(m => m.name === name)
    if(!f) {
        return []
    }
    return mods.filter(m => m.TID === f.TID)
}

export const getDroprateToTier = (name: string, artiLvl: number) => {
    const mods = getModuleInfo()
    const artis = getArtifacts()
    const f = mods.find(m => m.name === name)
    if(!f) {
        return null
    }
    const a = artis.find(a => !!a.TID.find(t => t === f.TID))
    if(!a) {
        return null
    }
    //console.log(artiLvl)
    const drop = a.drop[(artiLvl-1).toString()][f.tier]
    const researchTime = a.timeToResearch[artiLvl-2]
    return {
        drop,
        researchTime
    }
}

export const basicCalc = (bps: {current: number, target: number}, rate: number[], siblings: number) => {
    return {
        worstCase: (bps.target-bps.current)/rate[0]*siblings,
        bestCase: (bps.target-bps.current)/rate[1]*siblings
    }
}

interface ArtiResult {
    worstCase: number,
    bestCase: number,
    avgCase: number,
}

interface TempModuleCalcData { bestCaseArtiNeedToTarget: number; worstCaseArtiNeedToTarget: number; avgCaseArtiNeedToTarget: number; module: ModuleArtifactInfo; currentBps: number; selcted: boolean; target: number }

export const nonBasicCalc = (siblings: ModuleArtifactInfo[], bps: number[], selected: ModuleArtifactInfo, target: number, drops: number[], bonus: number) => {
    const data: TempModuleCalcData[] = siblings.map((s, idx) => {
        const allPossibleDrops = Array.from({length:drops[1] - drops[0] + 1},(v,k)=>(k+drops[0])*(1+bonus/100))
        const isSelected = s.name === selected.name;
        const currentBps = bps[idx] ?? 0
        const currentTarget = isSelected ? target : s.milestones[s.milestones.length-1]
        const t = currentTarget-currentBps > 0 ? currentTarget-currentBps : 0
        return {
            module: s,
            currentBps: currentBps,
            selcted: isSelected,
            target: currentTarget,
            worstCaseArtiNeedToTarget: Math.ceil(t/allPossibleDrops[0]),
            bestCaseArtiNeedToTarget: Math.ceil(t/allPossibleDrops[allPossibleDrops.length - 1]),
            avgCaseArtiNeedToTarget: Math.ceil(t/(allPossibleDrops.reduce((a, b) => a+b, 0)/(allPossibleDrops.length)))
        }
    })

    const rec = (data: TempModuleCalcData[], acc: (ArtiResult & {siblings: number})[]): ArtiResult => {
        const min = minBy(data, d => d.worstCaseArtiNeedToTarget)
        if(!min) {
            return {
                worstCase: 0,
                bestCase: 0,
                avgCase: 0,
            }
        }
        //console.log(min.module.name, min.worstCaseArtiNeedToTarget)
        const thisArtiNeed = {
            worstCase: min.worstCaseArtiNeedToTarget - sumBy(acc, a => a.worstCase),
            bestCase: min.bestCaseArtiNeedToTarget - sumBy(acc, a => a.bestCase),
            avgCase: min.avgCaseArtiNeedToTarget - sumBy(acc, a => a.avgCase),
            siblings: data.length
        }
        //console.log(min.module.name, min.worstCaseArtiNeedToTarget, thisArtiNeed)
        const newAcc = [thisArtiNeed, ...acc]
        if(min.module.name === selected.name) {
            return {
                worstCase: sumBy(newAcc, a => a.worstCase * a.siblings),
                bestCase: sumBy(newAcc, a => a.bestCase * a.siblings),
                avgCase: sumBy(newAcc, a => a.avgCase * a.siblings),
            }
        } else {
            return rec(data.filter(e => e !== min),newAcc)
        }
    }

    return rec(data, [])
}