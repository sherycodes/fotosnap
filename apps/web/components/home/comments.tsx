'use client';

import { useTRPC } from '@/lib/trpc/client';
import { CommentsProps } from '@/lib/types';
import { formatRelativeTime, getImageUrl } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import UserAvatar from '../shared/user-avatar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const Comments = ({ postId, onAddComment, onDeleteComment }: CommentsProps) => {
  const router = useRouter();
  const trpc = useTRPC();
  const [commentText, setCommentText] = useState('');
  const { data: comments = [], isPending } = useQuery(
    trpc.commentsRouter.findByPostId.queryOptions({ postId }),
  );

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onAddComment(commentText.trim());
      setCommentText('');
    }
  };

  return (
    <div className='space-y-4'>
      <div className='space-y-3 max-h-64 overflow-y-auto'>
        {comments.map(({ id, user, text, createdAt }) => (
          <div className='flex space-x-2' key={id}>
            <div className='pt-1 shrink-0'>
              <UserAvatar
                avatar={getImageUrl(user.avatar)}
                username={user.username}
                userId={user.id}
              />
            </div>
            <div className='flex-1 min-w-0'>
              <div className='flex items-center justify-between gap-2'>
                <div className='flex-1 min-w-0'>
                  <Button
                    variant='ghost'
                    onClick={() => router.push(`/users/${user.id}`)}
                    className='font-semibold text-sm p-0 mt-1'
                  >
                    {user.username}
                  </Button>
                  <p className='text-sm wrap-break-word'>{text}</p>
                  <time
                    dateTime={createdAt}
                    title={new Date(createdAt).toLocaleString('en')}
                    className='text-xs text-muted-foreground mt-1'
                    suppressHydrationWarning
                  >
                    {formatRelativeTime(createdAt)}
                  </time>
                </div>
                <Button
                  variant='ghost'
                  size='sm'
                  className='p-1 shrink-0 h-auto'
                  onClick={() => onDeleteComment(id)}
                >
                  <Trash className='size-3 text-muted-foreground' />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {isPending && (
          <p className='text-sm text-muted-foreground text-center py-4'>
            Loading comments...
          </p>
        )}

        {!isPending && comments.length === 0 && (
          <p className='text-sm text-muted-foreground text-center py-4'>
            No comments yet. Be the first to comment!
          </p>
        )}

        <form onSubmit={handleSubmit} className='flex items-center space-x-2'>
          <Input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder='Add a comment...'
            className='flex-1'
          />
          <Button type='submit' disabled={!commentText.trim()}>
            Post
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Comments;
