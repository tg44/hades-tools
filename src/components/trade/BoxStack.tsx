import {FC, useState} from "react";
import {ChainProps} from "./index";

const BoxStack: FC<
	ChainProps & {C1: FC<ChainProps>; currentDepth: number; maxDepth: number}
> = ({
	prevLevel,
	prevNr,
	hUsageProps,
	lvlCb,
	nrCb,
	tripCb,
	C1,
	currentDepth,
	maxDepth,
}) => {
	const [middleLvl, setMiddleLvl] = useState<number>(1);
	const [middleNr, setMiddleNr] = useState<number>(1);
	const [currentTrips, setCurrentTrips] = useState<number>(1);

	if (currentDepth === maxDepth) {
		return (
			<C1
				prevLevel={prevLevel}
				prevNr={prevNr}
				hUsageProps={hUsageProps}
				lvlCb={lvlCb}
				nrCb={nrCb}
				tripCb={tripCb}
			/>
		);
	} else {
		return (
			<>
				<C1
					prevLevel={prevLevel}
					prevNr={prevNr}
					hUsageProps={hUsageProps}
					lvlCb={setMiddleLvl}
					nrCb={setMiddleNr}
					tripCb={setCurrentTrips}
				/>
				<BoxStack
					prevLevel={middleLvl}
					prevNr={middleNr}
					hUsageProps={hUsageProps}
					lvlCb={lvlCb}
					nrCb={nrCb}
					tripCb={(t) => tripCb(t + currentTrips)}
					C1={C1}
					currentDepth={currentDepth + 1}
					maxDepth={maxDepth}
				/>
			</>
		);
	}
};

export default BoxStack;
