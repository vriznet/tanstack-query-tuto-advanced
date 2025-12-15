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
          <li>
            <Link href="/contents/create-random-user">Create Random User</Link>
          </li>
          <li>
            <Link href="/contents/create-random-project">
              Create Random Project
            </Link>
          </li>
          <li>
            <Link href="/contents/create-random-article">
              Create Random Article
            </Link>
          </li>
          <li>
            <Link href="/contents/create-random-comment">
              Create Random Comment
            </Link>
          </li>
          <li>
            <Link href="/contents/create-random-graph">
              Create Random Graph
            </Link>
          </li>
          <li>
            <Link href="/contents/performance-request-waterfall-single-component">
              Performance Request Waterfall - Single Component
            </Link>
          </li>
          <li>
            <Link href="/contents/performance-request-waterfall-nested-component">
              Performance Request Waterfall - Nested Component
            </Link>
          </li>
          <li>
            <Link href="/contents/performance-request-waterfall-hoist-query">
              Performance Request Waterfall - Hoist Query
            </Link>
          </li>
          <li>
            <Link href="/contents/performance-request-waterfall-dependent-nested-component">
              Performance Request Waterfall - Dependent Nested Component
            </Link>
          </li>
          <li>
            <Link href="/contents/performance-request-waterfall-code-splitting">
              Performance Request Waterfall - Code Splitting
            </Link>
          </li>
          <li>
            <Link href="/contents/prefetching-basics">Prefetching Basics</Link>
          </li>
        </ol>
      </main>
    </div>
  );
};

export default Home;
