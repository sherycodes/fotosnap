'use client';

import { PostModal } from '@/components/modals/post-modal';
import ProfileHeader from '@/components/profile/profile-header';
import { ProfileNavigation } from '@/components/profile/profile-navigation';
import { ProfileTabs } from '@/components/profile/profile-tabs';
import EmptyState from '@/components/shared/empty-state';
import { useTRPC } from '@/lib/trpc/client';
import { Post } from '@repo/trpc/schemas';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useState } from 'react';

const ProfileClient = ({ userId }: { userId: string }) => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const profileQueryKey = trpc.usersRouter.getUserProfile.queryKey({ userId });
  const { data: profile } = useSuspenseQuery(
    trpc.usersRouter.getUserProfile.queryOptions({ userId }),
  );

  const { data: posts = [] } = useSuspenseQuery(
    trpc.postsRouter.findAll.queryOptions({ userId }),
  );

  const unfollowMutation = useMutation(
    trpc.usersRouter.unfollow.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: profileQueryKey });
      },
    }),
  );

  const followMutation = useMutation(
    trpc.usersRouter.follow.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: profileQueryKey });
      },
    }),
  );

  const handleFollowToggle = () => {
    if (!profile) {
      return;
    }
    if (profile?.isFollowing) {
      unfollowMutation.mutate({ userId: profile.id });
    } else {
      followMutation.mutate({ userId: profile.id });
    }
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  if (!profile) {
    return (
      <EmptyState
        title='User not found'
        description="This user doesn't exist"
      />
    );
  }
  return (
    <div className='min-h-screen bg-background'>
      <ProfileNavigation />

      <div className='max-w-4xl mx-auto px-4 py-8'>
        <ProfileHeader
          profile={profile}
          onFollowToggle={handleFollowToggle}

          isFollowLoading={
            followMutation.isPending || unfollowMutation.isPending
          }
        />
        <ProfileTabs
          userPosts={posts}
          savedPosts={[]}
          name={profile.name}
          onPostClick={handlePostClick}
        />
      </div>

      {selectedPost && (
        <PostModal
          post={selectedPost}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      )}
    </div>
  );
};

export default ProfileClient;
