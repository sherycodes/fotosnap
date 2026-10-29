import PageLoader from '@/components/shared/page-loader';
import {
  getQueryClient,
  HydrateClient,
  prefetch,
  trpc,
} from '@/lib/trpc/server';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import ProfileClient from './profile-client';

interface PageProps {
  params: Promise<{ userId: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { userId } = await params;

  try {
    const profile = await getQueryClient().query(
      trpc.usersRouter.getUserProfile.queryOptions({ userId }),
    );

    return {
      title: profile.name,
      description:
        profile.bio || `See photos shared by ${profile.name} on Fotosnap.`,
    };
  } catch {
    return { title: 'Profile' };
  }
}

export default async function ProfilePage({ params }: PageProps) {
  const { userId } = await params;
  prefetch(trpc.usersRouter.getUserProfile.queryOptions({ userId }));
  prefetch(trpc.postsRouter.findAll.queryOptions({ userId }));
  return (
    <HydrateClient>
      <Suspense fallback={<PageLoader />}>
        <ProfileClient userId={userId} />
      </Suspense>
    </HydrateClient>
  );
}
