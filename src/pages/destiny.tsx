import type { NextPage } from 'next'
import dynamic from "next/dynamic";
import Layout, {pages} from "../components/Layout";


const NoSSRCanvas = dynamic(() => import("../components/destiny/Canvas"), {
    ssr: false,
});

const Home: NextPage = () => {
  return (
      <Layout pages={pages}>
        <NoSSRCanvas />
      </Layout>
  );
}

export default Home
