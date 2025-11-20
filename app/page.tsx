import Head from "next/head";
import Link from "next/link";

const Home = () => {
  return (
    <div>
      <Head>
        <title>TanStack Query - Advanced</title>
      </Head>
      <main>
        <h1>Choose the page</h1>
        <ol>
          <li>
            <Link href="/contents/mutations">Mutations</Link>
          </li>
        </ol>
      </main>
    </div>
  );
};

export default Home;
