import { HydrateClient, prefetch, trpc } from '@/lib/trpc/server';
import ProfileClient from './profile-client';
import { Suspense } from 'react';
import { Spinner } from '@/components/ui/spinner';

interface PageProps {
  params: Promise<{ userId: string }>;
}

export default async function ProfilePage({ params }: PageProps) {
  const { userId } = await params;
  prefetch(trpc.usersRouter.getUserProfile.queryOptions({ userId }));
  prefetch(trpc.postsRouter.findAll.queryOptions({ userId }));
  return (
    <HydrateClient>
      <Suspense
        fallback={
          <div className='min-h-screen flex-center'>
            <Spinner className='size-8' />
          </div>
        }
      >
        <ProfileClient userId={userId} />
      </Suspense>
    </HydrateClient>
  );
}
