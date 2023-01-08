import {default as Arts} from "../static/artifacts.js";
import {default as Ships} from "../static/capital_ships.js";
import {default as Moduls} from "../static/modules.js";

interface Salvage {
	cr: number;
	hr: number;
}

export const getSalvageValues = (lvl: number, nr: number): Salvage => {
	let cr = 0;
	let hr = 0;
	if (lvl > 1) {
		cr =
			(Arts.Combat.SalvageCRReward[lvl - 1] +
				Arts.Utility.SalvageCRReward[lvl - 1] +
				Arts.Support.SalvageCRReward[lvl - 2]) /
			3;
		hr =
			(Arts.Combat.SalvageHydroReward[lvl - 1] +
				Arts.Utility.SalvageHydroReward[lvl - 1] +
				Arts.Support.SalvageHydroReward[lvl - 2]) /
			3;
	} else {
		cr =
			(Arts.Combat.SalvageCRReward[lvl - 1] +
				Arts.Utility.SalvageCRReward[lvl - 1]) /
			2;
		hr =
			(Arts.Combat.SalvageHydroReward[lvl - 1] +
				Arts.Utility.SalvageHydroReward[lvl - 1]) /
			2;
	}
	return {
		cr: Math.floor(cr * nr),
		hr: Math.floor(hr * nr),
	};
};

export const getTsCapacity = (tsLevel: number, cbeLevel: number) => {
	return (
		Ships.Transport.JobCapacity[tsLevel - 1] +
		Moduls.TransportCapacity.ExtraTradeSlots[cbeLevel - 1]
	);
};

export const getArtCapacity = (
	lvl: number,
	tsLevel: number,
	cbeLevel: number,
) => {
	const artCapacity = Arts.Utility.SlotsUsed[lvl - 1];
	return Math.floor(getTsCapacity(tsLevel, cbeLevel) / artCapacity);
};

export const getHUsage = (tsLevel: number, cbeLevel: number) => {
	const capacity =
		Ships.Transport.FuelUsePer5000Distance[tsLevel - 1] +
		Moduls.TransportCapacity.FuelUseIncrease[cbeLevel - 1];
	return (capacity / 500) * 100;
};
