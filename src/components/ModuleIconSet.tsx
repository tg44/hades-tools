import {Attacker} from "../utils/destiny/types";
import {ImageList, ImageListItem, Paper} from "@mui/material";
import {ModuleArtifactInfo} from "../utils/artifacts";
import Image from "next/image";
import {groupBy} from "../utils/helpers";
import {useMemo} from "react";


const url = (iconName: string) => `https://github.com/userXinos/HadesSpace/blob/master/src/img/game/Modules/${iconName}.png?raw=true`


const ModuleIconSet = (props: { mods: ModuleArtifactInfo[], selected: ModuleArtifactInfo | undefined, setSelected: (module: ModuleArtifactInfo) => void }) => {
    const mods = useMemo(() => {
        return groupBy(props.mods, m => m.slotType)
    }, [props.mods])

    return (
        <div style={{backgroundColor: '#444444', padding: '5px'}}>
            {Object.values(mods).map((v, idx) =>
                <ImageList key={idx} style={{paddingTop: '3px'}} cols={8}>
                    {v.map((item) => (
                        <ImageListItem
                            key={item.name}
                            style={item === props.selected ? {
                                border: '1.5px',
                                borderColor: 'azure',
                                borderStyle: 'solid'
                            } : {}}
                            onClick={() => props.setSelected(item)}
                        >
                            <div style={{width: "35px", height: "35px"}}>
                                <Image
                                    src={url(item.icon)}
                                    alt={item.name}
                                    loading="lazy"
                                    layout={'fill'}
                                    objectFit={'contain'}
                                />
                            </div>
                        </ImageListItem>
                    ))}
                </ImageList>
            )}
        </div>
    )


}

export default ModuleIconSet