import {default as Ships} from "../static/capital_ships.js"
import {default as Modules} from "../static/modules.js"

export class Coordinate {
    x: number;
    y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }
}

export class Attacker {
    destinyLevel: number;
    coordinate: Coordinate;
    dmg = () => {
        return Modules["Destiny"]["AOEDamage_WS"][this.destinyLevel-1]
    }

    copyWithCoordinates(x: number, y: number) {
        return new Attacker(this.destinyLevel, new Coordinate(x, y));
    }

    constructor(destinyLevel: number, coordinate: Coordinate = new Coordinate()) {
        this.destinyLevel = destinyLevel;
        this.coordinate = coordinate
    }
}

type ShipType = 'bs' | 'miner' | 'transport' | 'relicDrone'

export class Ship {
     id: string;
     hullHp: number;
     personalShieldHp: number;
     blastShieldHp: number;
     areaShieldLevel: number;
     areaShieldHp: number;
     coordinate: Coordinate;
     type: ShipType;
     chanceOfDeath: number | null;

     copyWithCoordinates(x: number, y: number) {
         return new Ship(this.id, this.type, this.hullHp, this.personalShieldHp, this.blastShieldHp, this.areaShieldLevel, this.areaShieldHp, new Coordinate(x, y));
     }

    setChanceOfDeath(x: number) {
        const ns = new Ship(this.id, this.type, this.hullHp, this.personalShieldHp, this.blastShieldHp, this.areaShieldLevel, this.areaShieldHp, this.coordinate);
        ns.chanceOfDeath = x;
        return ns;
    }

    constructor(id: string, type: ShipType, hullHp: number, personalShieldHp: number = 0, blastShieldHp: number = 0, areaShieldLevel: number = 0, areaShieldHp: number = 0, coordinate: Coordinate = new Coordinate()) {
        this.id = id;
        this.type = type;
        this.hullHp = hullHp;
        this.personalShieldHp = personalShieldHp;
        this.blastShieldHp = blastShieldHp;
        this.areaShieldLevel = areaShieldLevel;
        this.areaShieldHp = areaShieldHp;
        this.coordinate = coordinate;
        this.chanceOfDeath = null
    }
}

export const fullHpByBsLevel = (bsLevel: number) => {
    return Ships["Battleship"]["HP"][bsLevel-1];
}

export const fullHpByTypeAndLevel = (type: ShipType, lvl: number) => {
    if('miner') return Ships["Miner"]["HP"]
    if('transport') return Ships["Transport"]["HP"]
    if('relicDrone') return Modules["RelicDrone"]["drone"]["HP"]
    if('bs') return Ships["Battleship"]["HP"][lvl-1];

    return 0
}

export const blastShieldHp = (blastShieldLevel: number) => {
    return Modules["BlastShield"]["ShieldStrength"][blastShieldLevel-1]
}

export const areaShieldHp = (areaShieldLevel: number) => {
    return Modules["AreaShield"]["ShieldStrength"][areaShieldLevel-1]
}

export const createFullBlastShield = (id: string, blastLevel: number, bsLevel: number) => {
    return new Ship(id, 'bs', fullHpByBsLevel(bsLevel), 0, blastShieldHp(blastLevel));
}

export const createFullAreaShield = (id: string, areaLevel: number, bsLevel: number) => {
    return new Ship(id, 'bs', fullHpByBsLevel(bsLevel), 0, 0, areaLevel, areaShieldHp(areaLevel));
}

export const createRelicDrone = (id: string, coordinate = new Coordinate()) => {
    return new Ship(id, 'relicDrone', Modules["RelicDrone"]["drone"]["HP"], 0, 0, 0, 0, coordinate);
}

export const createTransport = (id: string, coordinate = new Coordinate()) => {
    return new Ship(id, 'transport', Ships["Transport"]["HP"], 0, 0, 0, 0, coordinate);
}

export const createMiner = (id: string, coordinate = new Coordinate()) => {
    return new Ship(id, 'miner', Ships["Miner"]["HP"], 0, 0, 0, 0, coordinate);
}
