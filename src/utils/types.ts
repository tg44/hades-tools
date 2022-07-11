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

    constructor(destinyLevel: number, coordinate: Coordinate = new Coordinate()) {
        this.destinyLevel = destinyLevel;
        this.coordinate = coordinate
    }
}

export class Ship {
     id: string;
     hullHp: number;
     personalShieldHp: number;
     blastShieldHp: number;
     areaShieldLevel: number;
     areaShieldHp: number;
     coordinate: Coordinate;


    constructor(id: string, hullHp: number, personalShieldHp: number = 0, blastShieldHp: number = 0, areaShieldLevel: number = 0, areaShieldHp: number = 0, coordinate: Coordinate = new Coordinate()) {
        this.id = id;
        this.hullHp = hullHp;
        this.personalShieldHp = personalShieldHp;
        this.blastShieldHp = blastShieldHp;
        this.areaShieldLevel = areaShieldLevel;
        this.areaShieldHp = areaShieldHp;
        this.coordinate = coordinate;
    }
}

const fullHpByBsLevel = (bsLevel: number) => {
    return Ships["Battleship"]["HP"][bsLevel-1];
}

const blastShieldHp = (blastShieldLevel: number) => {
    return Modules["BlastShield"]["ShieldStrength"][blastShieldLevel-1]
}

const areaShieldHp = (areaShieldLevel: number) => {
    return Modules["AreaShield"]["ShieldStrength"][areaShieldLevel-1]
}

export const createFullBlastShield = (id: string, blastLevel: number, bsLevel: number) => {
    return new Ship(id, fullHpByBsLevel(bsLevel), 0, blastShieldHp(blastLevel));
}

export const createFullAreaShield = (id: string, areaLevel: number, bsLevel: number) => {
    return new Ship(id, fullHpByBsLevel(bsLevel), 0, 0, areaLevel, areaShieldHp(areaLevel));
}

export const createRelicDrone = (id: string) => {
    return new Ship(id, Modules["RelicDrone"]["drone"]["HP"]);
}


