import {Attacker, createFullAreaShield, createFullBlastShield, createRelicDrone, Ship} from "./types";
import {aggregateOutput, chanceToDie, solveSingleAttacker} from "./mechanics";


const attacker = new Attacker(8)

const defender1 = createFullBlastShield("b1", 2, 2)
const defender2 = createFullAreaShield("a1", 2, 2)
const defender3 = new Ship("useless1", 9000, 15000, 0, 0);
const drone1 = createRelicDrone("r1")
const drone2 = createRelicDrone("r2")

const drone3 = createRelicDrone("r3")


export const test = () => {
    //console.log(solveSingleAttacker(attacker.dmg(), [defender1, drone1]));
    //console.log(chanceToDie(aggregateOutput(solveSingleAttacker(attacker.dmg(), [defender1, drone1]))));
    //console.log(JSON.stringify(solveSingleAttacker(attacker.dmg(), [defender1, defender2, drone1, drone2])[0]))
    //console.log(solveSingleAttacker(attacker.dmg(), [defender1, defender2, drone1, drone2]))
    console.log(chanceToDie(aggregateOutput(solveSingleAttacker(attacker.dmg(), [defender1, defender2, drone1, drone2]))))
    //console.log(aggregateOutput(solveSingleAttacker(attacker.dmg(), [defender1, defender2, drone1, drone2, drone3])))
}

