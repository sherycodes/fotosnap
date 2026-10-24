import Feed from '@/components/home/feed';
import Stories from '@/components/home/stories';
import { HydrateClient, prefetch, trpc } from '@/lib/trpc/server';
import { Suspense } from 'react';

export default async function Home() {
  prefetch(trpc.postsRouter.findAll.queryOptions());
  return (
    <HydrateClient>
      <div className='min-h-screen bg-background'>
        <div className='max-w-6xl mx-auto px-4 py-8'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            <div className='lg:col-span-2 space-y-6'>
              <Stories />
              <Suspense fallback={<div>Loading...</div>}>
                <Feed />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </HydrateClient>
  );
}
