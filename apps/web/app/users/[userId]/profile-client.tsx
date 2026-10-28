'use client';

import { EditProfileModal } from '@/components/modals/edit-profile';
import { FollowersFollowingModal } from '@/components/modals/followers-following-modal';
import { PostModal } from '@/components/modals/post-modal';
import ProfileHeader from '@/components/profile/profile-header';
import { ProfileNavigation } from '@/components/profile/profile-navigation';
import { ProfileTabs } from '@/components/profile/profile-tabs';
import EmptyState from '@/components/shared/empty-state';
import { authClient } from '@/lib/auth/client';
import { useTRPC } from '@/lib/trpc/client';
import { Post, UpdateProfileInput } from '@repo/trpc/schemas';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useState } from 'react';

const ProfileClient = ({ userId }: { userId: string }) => {
  const { data: session } = authClient.useSession();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [followersFollowingModal, setFollowersFollowingModal] = useState<{
    open: boolean;
    type: 'followers' | 'following';
  }>({
    open: false,
    type: 'followers',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const profileQueryKey = trpc.usersRouter.getUserProfile.queryKey({ userId });
  const followersQueryKey = trpc.usersRouter.getFollowers.queryKey({ userId });
  const followingQueryKey = trpc.usersRouter.getFollowing.queryKey({ userId });
  const { data: profile } = useSuspenseQuery(
    trpc.usersRouter.getUserProfile.queryOptions({ userId }),
  );

  const { data: posts = [] } = useSuspenseQuery(
    trpc.postsRouter.findAll.queryOptions({ userId }),
  );

  const { data: bookmarks = [] } = useSuspenseQuery(
    trpc.postsRouter.getBookmarks.queryOptions(),
  );

  const unfollowMutation = useMutation(
    trpc.usersRouter.unfollow.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: followersQueryKey,
        });
        queryClient.invalidateQueries({
          queryKey: followingQueryKey,
        });
        queryClient.invalidateQueries({
          queryKey: profileQueryKey,
        });
      },
    }),
  );

  const followMutation = useMutation(
    trpc.usersRouter.follow.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: followersQueryKey,
        });
        queryClient.invalidateQueries({
          queryKey: followingQueryKey,
        });
        queryClient.invalidateQueries({
          queryKey: profileQueryKey,
        });
      },
    }),
  );

  const updateProfileMutation = useMutation(
    trpc.usersRouter.updateProfile.mutationOptions({
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

  const handleSaveProfile = (data: UpdateProfileInput) => {
    updateProfileMutation.mutate(data);
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
          onEditProfile={() => setIsEditProfileOpen(true)}
          isFollowLoading={
            followMutation.isPending || unfollowMutation.isPending
          }
          onOpenFollowers={() =>
            setFollowersFollowingModal({ open: true, type: 'followers' })
          }
          onOpenFollowing={() =>
            setFollowersFollowingModal({ open: true, type: 'following' })
          }
          isOwnProfile={session?.user.id === profile.id}
        />
        <ProfileTabs
          userPosts={posts}
          bookmarks={bookmarks}
          name={profile.name}
          onPostClick={handlePostClick}
          isOwnProfile={session?.user.id === profile.id}
        />
      </div>

      {selectedPost && (
        <PostModal
          post={selectedPost}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      )}

      <EditProfileModal
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
        profile={profile}
        onSave={handleSaveProfile}
      />

      <FollowersFollowingModal
        open={followersFollowingModal.open}
        onOpenChange={(open) => {
          setFollowersFollowingModal({ ...followersFollowingModal, open });
        }}
        userId={userId}
        type={followersFollowingModal.type}
      />
    </div>
  );
};

export default ProfileClient;
