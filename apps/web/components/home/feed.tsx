'use client';

import { useTRPC } from '@/lib/trpc/client';
import { formatRelativeTime, getImageUrl } from '@/lib/utils';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { Heart, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import UserAvatar from '../shared/user-avatar';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

export default function Feed() {
  const trpc = useTRPC();
  const { data: posts } = useSuspenseQuery(
    trpc.postsRouter.findAll.queryOptions(),
  );

  const queryClient = useQueryClient();
  const postsKey = trpc.postsRouter.findAll.queryKey();
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

  return (
    <div className='space-y-6'>
      {posts.map(
        ({
          id,
          image,
          likes,
          comments,
          caption,
          createdAt,
          isLiked,
          user: { avatar, username },
        }) => (
          <Card key={id} className='overflow-hidden'>
            <div className='flex items-center justify-between p-4'>
              <div className='flex items-center space-x-3'>
                <UserAvatar
                  avatar={avatar ? getImageUrl(avatar) : null}
                  username={username}
                />
                <span className='font-semibold text-sm'>{username}</span>
              </div>
            </div>

            <div className='aspect-square relative'>
              <Image
                src={getImageUrl(image)}
                alt='Post'
                className='object-cover'
                fill
              />
            </div>

            <div className='p-4 space-y-3'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-4'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => toggleLike.mutate({ postId: id })}
                    className='p-0 h-auto'
                  >
                    <Heart
                      className={`size-6 ${isLiked ? 'fill-red-500 text-red-500' : 'text-foreground'}`}
                    />
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => {}}
                    className='p-0 h-auto'
                  >
                    <MessageCircle className='size-6 text-foreground' />
                  </Button>
                </div>
              </div>

              <div className='text-sm font-semibold'>{likes} likes</div>

              <div className='text-sm'>
                <span className='font-semibold'>{username} </span>
                {caption}
              </div>

              {comments > 0 && (
                <div className='text-sm text-muted-foreground'>
                  View all {comments} comments
                </div>
              )}

              <time
                dateTime={createdAt}
                title={new Date(createdAt).toLocaleString('en')}
                className='block text-xs text-muted-foreground uppercase'
                suppressHydrationWarning
              >
                {formatRelativeTime(createdAt)}
              </time>
            </div>
          </Card>
        ),
      )}
    </div>
  );
}
