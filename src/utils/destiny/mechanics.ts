import {Attacker, Coordinate, Ship} from "./types";
import {groupBy} from "../helpers";
import {default as Modules} from "../../static/modules.js";

export const aggregateOutput = (outs: IterationOutput[][]) => {
	return groupBy(
		outs.flatMap((e) => e),
		(o) => o.defenderId,
	);
};

export const chanceToDie = (input: Record<string, IterationOutput[]>) => {
	return Object.entries(input).map(([k, v]) => {
		const dies = v.filter((o) => o.defenderHp === 0).length;
		return {id: k, dc: dies > 0 ? dies / v.length : 0};
	});
};

export const solveSingleAttacker = (
	dmg: Cover,
	allDefenders: Ship[],
	remainingBlastCovers?: Cover[],
	remainingAreaCovers?: Cover[],
): IterationOutput[][] => {
	const blastCovers = (
		remainingBlastCovers ?? allDefenders.map((d) => shipToBlastCover(d))
	).filter((c) => c.amount > 0);
	const areaCovers = (
		remainingAreaCovers ?? allDefenders.map((d) => shipToAreaCover(d))
	).filter((c) => c.amount > 0);
	const defenders = allDefenders.filter((d) => isInCover(d.coordinate, dmg));
	return defenders.flatMap((d) => {
		const blastShields = blastCovers.filter((c) => isInCover(d.coordinate, c));
		const areaShields = areaCovers.filter((c) => isInCover(d.coordinate, c));
		const otherShips = defenders.filter((ad) => ad !== d);

		if (blastShields.length > 1 || areaShields.length > 1) {
			//complicated iteration
			const ret = multiShieldIteration(
				d,
				dmg.amount,
				blastShields,
				areaShields,
			);
			if (otherShips.length > 0) {
				return ret.remainingBlastCovers.flatMap((blasts) => {
					return ret.remainingAreaCovers.flatMap((areas) => {
						const ret2 = {
							remainingBlastCovers: blasts,
							remainingAreaCovers: areas,
							defenderHp: ret.defenderHp,
							defenderShieldHp: ret.defenderShieldHp,
							defenderId: ret.defenderId,
						};
						return solveSingleAttacker(dmg, otherShips, blasts, areas).map(
							(r) => [ret2, ...r],
						);
					});
				});
			} else {
				return ret.remainingBlastCovers.flatMap((blasts) => {
					return ret.remainingAreaCovers.flatMap((areas) => {
						return [
							[
								{
									remainingBlastCovers: blasts,
									remainingAreaCovers: areas,
									defenderHp: ret.defenderHp,
									defenderShieldHp: ret.defenderShieldHp,
									defenderId: ret.defenderId,
								},
							],
						];
					});
				});
			}
		} else {
			const ret = singleShieldIteration(
				d,
				dmg.amount,
				blastShields[0]?.amount || 0,
				areaShields[0]?.amount || 0,
			);
			const remBlastShields =
				blastShields.length > 0
					? [
							copyCoverWithAmount(blastShields[0], ret.remainingBlastCover),
							...blastCovers.filter((c) => c !== blastShields[0]),
					  ]
					: blastCovers;
			const remAreaShields =
				areaShields.length > 0
					? [
							copyCoverWithAmount(areaShields[0], ret.remainingAreaCover),
							...areaCovers.filter((c) => c !== areaShields[0]),
					  ]
					: areaCovers;
			const ret2 = {
				remainingBlastCovers: remBlastShields,
				remainingAreaCovers: remAreaShields,
				defenderHp: ret.defenderHp,
				defenderShieldHp: ret.defenderShieldHp,
				defenderId: ret.defenderId,
			};
			if (otherShips.length > 0) {
				return solveSingleAttacker(
					dmg,
					otherShips,
					remBlastShields,
					remAreaShields,
				).map((r) => [ret2, ...r]);
			} else {
				return [[ret2]];
			}
		}
	});
};

interface Output {
	defenderHp: number;
	defenderShieldHp: number;
	defenderId: string;
}

interface Cover {
	coordinate: Coordinate;
	radius: number;
	amount: number;
}

const copyCoverWithAmount = (c: Cover, am: number): Cover => {
	return {
		coordinate: c.coordinate,
		radius: c.radius,
		amount: am,
	};
};

export const isInCover = (coordinate: Coordinate, cover: Cover): boolean => {
	let x = coordinate.x - cover.coordinate.x;
	let y = coordinate.y - cover.coordinate.y;
	const dist = Math.sqrt(x * x + y * y);
	return dist < cover.radius;
};

const shipToBlastCover = (s: Ship): Cover => {
	return {
		coordinate: s.coordinate,
		radius: Modules["BlastShield"]["EffectRadius"],
		amount: s.blastShieldHp,
	};
};

const shipToAreaCover = (s: Ship): Cover => {
	return {
		coordinate: s.coordinate,
		radius: Modules["AreaShield"]["EffectRadiusWS"][s.areaShieldLevel || 0],
		amount: s.areaShieldHp,
	};
};

export const destinyCover = (s: Attacker): Cover => {
	return {
		coordinate: s.coordinate,
		radius: Modules["Destiny"]["EffectRadius"],
		amount: s.dmg(),
	};
};

interface SimpleIterationOutput {
	remainingBlastCover: number;
	remainingAreaCover: number;
	defenderHp: number;
	defenderShieldHp: number;
	defenderId: string;
}

interface MultiIterationOutput {
	remainingBlastCovers: Cover[][];
	remainingAreaCovers: Cover[][];
	defenderHp: number;
	defenderShieldHp: number;
	defenderId: string;
}

interface IterationOutput {
	remainingBlastCovers: Cover[];
	remainingAreaCovers: Cover[];
	defenderHp: number;
	defenderShieldHp: number;
	defenderId: string;
}

const singleShieldIteration = (
	defender: Ship,
	dmg: number,
	remainingBlastCover: number,
	remainingAreaCover: number,
): SimpleIterationOutput => {
	//fully covered blast
	if (remainingBlastCover > dmg) {
		return {
			remainingBlastCover: remainingBlastCover - dmg,
			remainingAreaCover,
			defenderHp: defender.hullHp,
			defenderShieldHp: defender.personalShieldHp,
			defenderId: defender.id,
		};
	} else {
		//we leaking blast
		const remDmg = dmg - remainingBlastCover;
		if (defender.personalShieldHp - remDmg > 0) {
			return {
				remainingBlastCover: 0,
				remainingAreaCover,
				defenderHp: defender.hullHp,
				defenderShieldHp: defender.personalShieldHp - remDmg,
				defenderId: defender.id,
			};
		} else {
			//we leaking personal shield to area
			const remDmg2 = remDmg - defender.personalShieldHp;
			if (remainingAreaCover - remDmg2 > 0) {
				return {
					remainingBlastCover: 0,
					remainingAreaCover: remainingAreaCover - remDmg2,
					defenderHp: defender.hullHp,
					defenderShieldHp: 0,
					defenderId: defender.id,
				};
			} else {
				const remDmg3 = remDmg2 - remainingAreaCover;
				return {
					remainingBlastCover: 0,
					remainingAreaCover: 0,
					defenderHp: Math.max(defender.hullHp - remDmg3, 0),
					defenderShieldHp: 0,
					defenderId: defender.id,
				};
			}
		}
	}
};

const hitCoversWithDmg = (dmg: number, covers: Cover[]): Cover[][] => {
	return covers.flatMap((c) => {
		const otherCovers = covers.filter((f) => f !== c);
		if (dmg > c.amount) {
			const zc = copyCoverWithAmount(c, 0);
			return hitCoversWithDmg(dmg - c.amount, otherCovers).map((a) => [
				zc,
				...a,
			]);
		} else {
			return [[copyCoverWithAmount(c, c.amount - dmg), ...otherCovers]];
		}
	});
};

const multiShieldIteration = (
	defender: Ship,
	dmg: number,
	remainingBlastCovers: Cover[],
	remainingAreaCovers: Cover[],
): MultiIterationOutput => {
	const fullBlastCover = remainingBlastCovers.reduce(
		(acc, s) => s.amount + acc,
		0,
	);
	const fullAreaCover = remainingAreaCovers.reduce(
		(acc, s) => s.amount + acc,
		0,
	);

	//fully covered blast
	if (fullBlastCover > dmg) {
		return {
			remainingBlastCovers: hitCoversWithDmg(dmg, remainingBlastCovers),
			remainingAreaCovers: [remainingAreaCovers],
			defenderHp: defender.hullHp,
			defenderShieldHp: defender.personalShieldHp,
			defenderId: defender.id,
		};
	} else {
		//we leaking blast
		const remDmg = dmg - fullBlastCover;
		if (defender.personalShieldHp - remDmg > 0) {
			return {
				remainingBlastCovers: [],
				remainingAreaCovers: [remainingAreaCovers],
				defenderHp: defender.hullHp,
				defenderShieldHp: defender.personalShieldHp - remDmg,
				defenderId: defender.id,
			};
		} else {
			//we leaking personal shield to area
			const remDmg2 = remDmg - defender.personalShieldHp;
			if (fullAreaCover - remDmg2 > 0) {
				return {
					remainingBlastCovers: [],
					remainingAreaCovers: hitCoversWithDmg(remDmg2, remainingAreaCovers),
					defenderHp: defender.hullHp,
					defenderShieldHp: 0,
					defenderId: defender.id,
				};
			} else {
				const remDmg3 = remDmg2 - fullAreaCover;
				return {
					remainingBlastCovers: [],
					remainingAreaCovers: [],
					defenderHp: Math.max(defender.hullHp - remDmg3, 0),
					defenderShieldHp: 0,
					defenderId: defender.id,
				};
			}
		}
	}
};
