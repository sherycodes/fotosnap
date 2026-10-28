'use client';

import { useTRPC } from '@/lib/trpc/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function usePostActions() {
  const trpc = useTRPC();

  const queryClient = useQueryClient();
  const postsKey = trpc.postsRouter.findAll.queryKey();
  const bookmarksKey = trpc.postsRouter.getBookmarks.queryKey();
  const toggleLike = useMutation(
    trpc.postsRouter.likePost.mutationOptions({
      onMutate: async ({ postId }) => {
        await queryClient.cancelQueries({ queryKey: postsKey });
        const previousPosts = queryClient.getQueryData(postsKey);
        queryClient.setQueryData(postsKey, (old) =>
          old?.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  isLiked: !post.isLiked,
                  likes: post.likes + (post.isLiked ? -1 : 1),
                }
              : post,
          ),
        );

        return { previousPosts };
      },
      onError: (_err, _vars, context) => {
        if (context?.previousPosts) {
          queryClient.setQueryData(postsKey, context.previousPosts);
        }
        toast.error('Could not update like');
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: postsKey });
      },
    }),
  );

  const toggleBookmark = useMutation(
    trpc.postsRouter.bookmarkPost.mutationOptions({
      onMutate: async ({ postId }) => {
        await queryClient.cancelQueries({ queryKey: postsKey });
        const previousPosts = queryClient.getQueryData(postsKey);
        queryClient.setQueryData(postsKey, (old) =>
          old?.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  isSaved: !post.isSaved,
                }
              : post,
          ),
        );

        return { previousPosts };
      },
      onError: (_err, _vars, context) => {
        if (context?.previousPosts) {
          queryClient.setQueryData(postsKey, context.previousPosts);
        }
        toast.error('Could not update bookmark');
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: postsKey });
        queryClient.invalidateQueries({ queryKey: bookmarksKey });
      },
    }),
  );

  const updateCommentCount = (postId: number, change: number) => {
    queryClient.setQueryData(postsKey, (old) =>
      old?.map((post) =>
        post.id === postId
          ? { ...post, comments: post.comments + change }
          : post,
      ),
    );
  };

  const addComment = useMutation(
    trpc.commentsRouter.create.mutationOptions({
      onSuccess: (_newComment, { postId }) => {
        updateCommentCount(postId, 1);
      },
      onError: () => {
        toast.error('Could not add comment');
      },
      onSettled: (_newComment, _error, { postId }) => {
        queryClient.invalidateQueries({
          queryKey: trpc.commentsRouter.findByPostId.queryKey({ postId }),
        });
      },
    }),
  );

  const deleteComment = useMutation(
    trpc.commentsRouter.delete.mutationOptions({
      onSuccess: (deletedComment) => {
        updateCommentCount(deletedComment.postId, -1);
      },
      onError: () => {
        toast.error('Could not delete comment');
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.commentsRouter.findByPostId.queryKey(),
        });
      },
    }),
  );

  return { deleteComment, addComment, toggleLike, toggleBookmark };
}
