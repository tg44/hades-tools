import type { NextPage } from 'next'
import dynamic from "next/dynamic";


const NoSSRCanvas = dynamic(() => import("../components/Canvas"), {
    ssr: false,
});

const Home: NextPage = () => {
  return (
      <NoSSRCanvas />
  );
}

export default Home
