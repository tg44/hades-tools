import {FC, useMemo} from "react";
import {getArtCapacity, getSalvageValues} from "../../utils/trade";
import {HUsageProps} from "./index";

const SummaryBox: FC<{level: number; nr: number; hUsageProps: HUsageProps}> = ({
	level,
	nr,
	hUsageProps,
}) => {
	const salvageValues = useMemo(() => getSalvageValues(level, nr), [level, nr]);
	const artPerShip = useMemo(
		() => getArtCapacity(level, hUsageProps.tsLevel, hUsageProps.cbeLevel),
		[level, hUsageProps],
	);
	const hCost = useMemo(
		() =>
			(Math.ceil(nr / artPerShip) *
				hUsageProps.hUsagePerShipPer100Au *
				hUsageProps.distancePerTrip) /
			100,
		[artPerShip, nr, hUsageProps],
	);

	return (
		<div>
			<ul>
				<li>
					Nr of arts: {nr.toLocaleString("en-us", {maximumFractionDigits: 2})}
				</li>
				<li>
					SalvageCr:{" "}
					{salvageValues.cr.toLocaleString("en-us", {maximumFractionDigits: 2})}
				</li>
				<li>
					SalvageH:{" "}
					{salvageValues.hr.toLocaleString("en-us", {maximumFractionDigits: 2})}
				</li>
			</ul>
			{hUsageProps.movementCalc && (
				<ul>
					<li>Art per ship: {artPerShip}</li>
					<li>Trips: {Math.ceil(nr / artPerShip)}</li>
					<li>Avg H cost of the trips: {hCost}</li>
					<li>
						H profit:{" "}
						{(salvageValues.hr - hCost).toLocaleString("en-us", {
							maximumFractionDigits: 2,
						})}
					</li>
				</ul>
			)}
		</div>
	);
};

export default SummaryBox;
