'use client';

import { useTRPC } from '@/lib/trpc/client';
import type { UserProfile } from '@repo/trpc/schemas';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useFollowActions() {
  const trpc = useTRPC();

  const queryClient = useQueryClient();
  const usersKey = trpc.usersRouter.pathKey();
  const profileKey = trpc.usersRouter.getUserProfile.pathKey();
  const followersKey = trpc.usersRouter.getFollowers.pathKey();
  const followingKey = trpc.usersRouter.getFollowing.pathKey();
  const suggestedKey = trpc.usersRouter.getSuggestedUsers.pathKey();

  const setFollowing = (userId: string, isFollowing: boolean) => {
    queryClient.setQueriesData<UserProfile>({ queryKey: profileKey }, (old) =>
      old?.id === userId
        ? {
            ...old,
            isFollowing,
            followerCount: old.followerCount + (isFollowing ? 1 : -1),
          }
        : old,
    );

    for (const queryKey of [followersKey, followingKey, suggestedKey]) {
      queryClient.setQueriesData<UserProfile[]>({ queryKey }, (old) =>
        old?.map((user) =>
          user.id === userId ? { ...user, isFollowing } : user,
        ),
      );
    }
  };

  const refreshUsers = () => {
    queryClient.invalidateQueries({ queryKey: profileKey });
    queryClient.invalidateQueries({ queryKey: followersKey });
    queryClient.invalidateQueries({ queryKey: followingKey });
    queryClient.invalidateQueries({
      queryKey: trpc.postsRouter.findAll.pathKey(),
    });
  };

  const follow = useMutation(
    trpc.usersRouter.follow.mutationOptions({
      onMutate: async ({ userId }) => {
        await queryClient.cancelQueries({ queryKey: usersKey });
        setFollowing(userId, true);
      },
      onError: (_err, { userId }) => {
        setFollowing(userId, false);
        toast.error('Could not follow user');
      },
      onSettled: refreshUsers,
    }),
  );

  const unfollow = useMutation(
    trpc.usersRouter.unfollow.mutationOptions({
      onMutate: async ({ userId }) => {
        await queryClient.cancelQueries({ queryKey: usersKey });
        setFollowing(userId, false);
      },
      onError: (_err, { userId }) => {
        setFollowing(userId, true);
        toast.error('Could not unfollow user');
      },
      onSettled: refreshUsers,
    }),
  );

  return { follow, unfollow };
}
