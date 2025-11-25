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
          <li>
            <Link href="/contents/query-invalidation">Query Invalidation</Link>
          </li>
          <li>
            <Link href="/contents/updates-from-mutation-responses">
              Updates from Mutation Responses
            </Link>
          </li>
          <li>
            <Link href="/contents/optimistic-updates-via-ui">
              Optimistic Updates - Via the UI
            </Link>
          </li>
          <li>
            <Link href="/contents/optimistic-updates-via-ui-use-mutation-state">
              Optimistic Updates - Via the UI - If the mutation and the query
              don't live in the same component (useMutationState)
            </Link>
          </li>
          <li>
            <Link href="/contents/optimistic-updates-via-cache">
              Optimistic Updates - Via the cache
            </Link>
          </li>
          <li>
            <Link href="/contents/optimistic-updates-via-cache-single-todo">
              Optimistic Updates - Via the cache - Single Todo
            </Link>
          </li>
        </ol>
      </main>
    </div>
  );
};

export default Home;
