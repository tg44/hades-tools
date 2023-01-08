import {FC, useMemo} from "react";
import {getSalvageValues} from "../../utils/trade";
import {HUsageProps} from "./index";

const ProfitBox: FC<{
    initialLevel: number,
    initialNr: number,
    endLevel: number,
    endNr: number,
    sumTrips: number,
    hUsageProps: HUsageProps
}> = ({
          initialLevel,
          initialNr,
          endLevel,
          endNr,
          sumTrips,
          hUsageProps,
      }) => {

    const initSalvageValues = useMemo(() => getSalvageValues(initialLevel, initialNr), [initialLevel, initialNr])
    const endSalvageValues = useMemo(() => getSalvageValues(endLevel, endNr), [endLevel, endNr])
    const hCost = useMemo(() => sumTrips * hUsageProps.hUsagePerShipPer100Au *hUsageProps.distancePerTrip/100, [sumTrips, hUsageProps])

    return <div>
        <ul>
            <li>Salvage CR profit: {(endSalvageValues.cr - initSalvageValues.cr).toLocaleString('en-us', {maximumFractionDigits: 2})}</li>
            <li>Salvage H profit: {(endSalvageValues.hr - initSalvageValues.hr).toLocaleString('en-us', {maximumFractionDigits: 2})}</li>
        </ul>
        {hUsageProps.movementCalc &&
            <ul>
                <li>Trips: {sumTrips}</li>
                <li>Sum H usage with trades: {hCost.toLocaleString('en-us', {maximumFractionDigits: 2})}</li>
                <li>H profit: {(endSalvageValues.hr - initSalvageValues.hr - hCost).toLocaleString('en-us', {maximumFractionDigits: 2})}</li>
            </ul>
        }
    </div>
}

export default ProfitBox