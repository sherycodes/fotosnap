'use client';

import { useTRPC } from '@/lib/trpc/client';
import type { Post } from '@repo/trpc/schemas';
import {
  type QueryKey,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

type Snapshot = [QueryKey, Post[] | undefined][];

export function usePostActions() {
  const trpc = useTRPC();

  const queryClient = useQueryClient();
  const postLists = [
    trpc.postsRouter.findAll.pathKey(),
    trpc.postsRouter.getBookmarks.pathKey(),
  ];

  const snapshotPosts = async (): Promise<Snapshot> => {
    await Promise.all(
      postLists.map((queryKey) => queryClient.cancelQueries({ queryKey })),
    );
    return postLists.flatMap((queryKey) =>
      queryClient.getQueriesData<Post[]>({ queryKey }),
    );
  };

  const updatePost = (postId: number, update: (post: Post) => Post) => {
    for (const queryKey of postLists) {
      queryClient.setQueriesData<Post[]>({ queryKey }, (old) =>
        old?.map((post) => (post.id === postId ? update(post) : post)),
      );
    }
  };

  const restorePosts = (snapshot?: Snapshot) => {
    for (const [queryKey, data] of snapshot ?? []) {
      queryClient.setQueryData(queryKey, data);
    }
  };

  const refreshPosts = () =>
    Promise.all(
      postLists.map((queryKey) => queryClient.invalidateQueries({ queryKey })),
    );

  const toggleLike = useMutation(
    trpc.postsRouter.likePost.mutationOptions({
      onMutate: async ({ postId }) => {
        const snapshot = await snapshotPosts();
        updatePost(postId, (post) => ({
          ...post,
          isLiked: !post.isLiked,
          likes: post.likes + (post.isLiked ? -1 : 1),
        }));
        return { snapshot };
      },
      onError: (_err, _vars, context) => {
        restorePosts(context?.snapshot);
        toast.error('Could not update like');
      },
      onSettled: refreshPosts,
    }),
  );

  const toggleBookmark = useMutation(
    trpc.postsRouter.bookmarkPost.mutationOptions({
      onMutate: async ({ postId }) => {
        const snapshot = await snapshotPosts();
        updatePost(postId, (post) => ({ ...post, isSaved: !post.isSaved }));
        return { snapshot };
      },
      onError: (_err, _vars, context) => {
        restorePosts(context?.snapshot);
        toast.error('Could not update bookmark');
      },
      onSettled: refreshPosts,
    }),
  );

  const updateCommentCount = (postId: number, change: number) => {
    updatePost(postId, (post) => ({
      ...post,
      comments: post.comments + change,
    }));
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
          queryKey: trpc.commentsRouter.findByPostId.pathKey(),
        });
      },
    }),
  );

  return { deleteComment, addComment, toggleLike, toggleBookmark };
}
