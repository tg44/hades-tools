import {default as Modules} from "../static/modules.js"
import {default as Artifacts} from "../static/artifacts.js"
import {ChangeEvent} from "react";

export interface ModuleArtifactInfo {
    name: string,
    TID: string,
    milestones: number[],
    tier: number,
    icon: string,
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
        worstCase: (bps.target-bps.current)/rate[0]/siblings,
        bestCase: (bps.target-bps.current)/rate[1]/siblings
    }
}