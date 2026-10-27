'use client';

import { usePostActions } from '@/hooks/usePostActions';
import { useTRPC } from '@/lib/trpc/client';
import { cn, formatRelativeTime, getImageUrl } from '@/lib/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Heart, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import UserAvatar from '../shared/user-avatar';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import Comments from './comments';

export default function Feed() {
  const [expandedComments, setExpandedComments] = useState<Set<number>>(
    new Set(),
  );
  const trpc = useTRPC();
  const { data: posts } = useSuspenseQuery(
    trpc.postsRouter.findAll.queryOptions(),
  );

  const { deleteComment, addComment, toggleLike } = usePostActions();

  const toggleComments = (postId: number) => {
    setExpandedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }

      return newSet;
    });
  };

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
          user: { id: userId, avatar, username },
        }) => (
          <Card key={id} className='overflow-hidden'>
            <div className='flex items-center justify-between p-4'>
              <div className='flex items-center space-x-3'>
                <UserAvatar
                  avatar={avatar ? getImageUrl(avatar) : null}
                  username={username}
                  userId={userId}
                />
                <Link
                  href={`/users/${userId}`}
                  className='font-semibold text-sm'
                >
                  {username}
                </Link>
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
                      className={cn(
                        'size-6',
                        isLiked
                          ? 'fill-red-500 text-red-500'
                          : 'text-foreground',
                      )}
                    />
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => toggleComments(id)}
                    className='p-0 h-auto'
                  >
                    <MessageCircle
                      className={cn(
                        'size-6',
                        expandedComments.has(id)
                          ? 'fill-primary text-primary'
                          : 'text-foreground',
                      )}
                    />
                  </Button>
                </div>
              </div>

              <div className='text-sm font-semibold'>{likes} likes</div>

              <div className='text-sm'>
                <span className='font-semibold'>{username} </span>
                {caption}
              </div>

              {comments > 0 && !expandedComments.has(id) && (
                <button
                  type='button'
                  className='text-sm text-muted-foreground'
                  onClick={() => toggleComments(id)}
                >
                  View all {comments} comments
                </button>
              )}

              {expandedComments.has(id) && (
                <Comments
                  postId={id}
                  onAddComment={(text) =>
                    addComment.mutate({ postId: id, text })
                  }
                  onDeleteComment={(commentId) =>
                    deleteComment.mutate({ commentId })
                  }
                />
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
