import {NextPage} from "next";
import {Button} from "@mui/material";

const Home: NextPage = () => {


    return (
        <>
            {/*@ts-ignore*/}
            <Button onClick={() => {window.location = '/destiny'}}> Destiny calc</Button>
            {/*@ts-ignore*/}
            <Button onClick={() => {window.location = '/research'}}> Research calc </Button>
        </>
    )
}

export default Home;