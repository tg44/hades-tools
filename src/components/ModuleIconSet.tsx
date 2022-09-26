import {Attacker} from "../utils/destiny/types";
import {ImageList, ImageListItem, Paper} from "@mui/material";
import {ModuleArtifactInfo} from "../utils/artifacts";
import Image from "next/image";


const url = (iconName: string) => `https://github.com/userXinos/HadesSpace/blob/master/src/img/game/Modules/${iconName}.png?raw=true`



const ModuleIconSet = (props: {mods: ModuleArtifactInfo[], selected: ModuleArtifactInfo | undefined, setSelected: (module: ModuleArtifactInfo) => void}) => {
    return (
        <ImageList cols={10}>
            {props.mods.map((item) => (
                <ImageListItem
                    key={item.name}
                    style={item === props.selected ? {border: '1px', borderColor: 'blue', borderStyle: 'solid'} : {}}
                    onClick={() => props.setSelected(item)}
                >
                    <Image
                        src={url(item.icon)}
                        alt={item.name}
                        loading="lazy"
                        width={40}
                        height={40}
                    />
                </ImageListItem>
            ))}
        </ImageList>
    )


}

export default ModuleIconSet