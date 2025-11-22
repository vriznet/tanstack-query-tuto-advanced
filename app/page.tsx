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
          <li>
            <Link href="/contents/mutations-persist-mutations">
              Mutations - Persist Mutations
            </Link>
          </li>
          <li>
            <Link href="/contents/create-random-todo">Create Random Todo</Link>
          </li>
        </ol>
      </main>
    </div>
  );
};

export default Home;
