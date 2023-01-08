export interface ChainProps {
	prevLevel: number;
	prevNr: number;
	hUsageProps: HUsageProps;
	lvlCb: (lvl: number) => void;
	nrCb: (nr: number) => void;
	tripCb: (tripCount: number) => void;
}

export interface HUsageProps {
	movementCalc: boolean;
	tsLevel: number;
	cbeLevel: number;
	distancePerTrip: number;
	hUsagePerShipPer100Au: number;
}
export const EmptyHUsageProps: HUsageProps = {
	movementCalc: false,
	tsLevel: 0,
	cbeLevel: 0,
	distancePerTrip: 0,
	hUsagePerShipPer100Au: 0,
};
