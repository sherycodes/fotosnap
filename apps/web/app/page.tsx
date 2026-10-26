import Feed from '@/components/home/feed';
import Sidebar from '@/components/home/sidebar';
import Stories from '@/components/home/stories';
import PhotoUpload from '@/components/models/photo-upload';
import { HydrateClient, prefetch, trpc } from '@/lib/trpc/server';
import { Suspense } from 'react';

export default async function Home() {
  prefetch(trpc.postsRouter.findAll.queryOptions());
  prefetch(trpc.storiesRouter.getStories.queryOptions());
  return (
    <HydrateClient>
      <div className='min-h-screen bg-background'>
        <div className='max-w-6xl mx-auto px-4 py-8'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            <div className='lg:col-span-2 space-y-6'>
              <Suspense fallback={<div>Loading...</div>}>
                <Stories />
                <Feed />
              </Suspense>
            </div>
            <div className='lg:sticky lg:top-8 lg:h-fit'>
              <Sidebar />
            </div>
          </div>
        </div>
        <PhotoUpload />
      </div>
    </HydrateClient>
  );
}
