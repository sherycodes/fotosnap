import 'server-only';

import { AppRouter } from '@repo/trpc/router';
import { createTRPCClient, httpLink } from '@trpc/client';
import {
  createTRPCOptionsProxy,
  TRPCQueryOptions,
} from '@trpc/tanstack-react-query';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { makeQueryClient } from './query-client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export const getQueryClient = cache(makeQueryClient);

export const trpc = createTRPCOptionsProxy<AppRouter>({
  queryClient: getQueryClient,
  client: createTRPCClient<AppRouter>({
    links: [
      httpLink({
        url: `${process.env.API_URL}/api/trpc`,
        headers: async () => ({ cookie: (await cookies()).toString() }),
      }),
    ],
  }),
});

export function HydrateClient(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
}

export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
  queryOptions: T
) {
  const queryClient = getQueryClient();
  if (queryOptions.queryKey[1]?.type === 'infinite') {
    void queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    void queryClient.prefetchQuery(queryOptions);
  }
}
