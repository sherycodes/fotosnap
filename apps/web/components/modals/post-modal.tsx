'use client';

import { usePostActions } from '@/hooks/usePostActions';
import { authClient } from '@/lib/auth/client';
import { useTRPC } from '@/lib/trpc/client';
import { PostModalProps } from '@/lib/types';
import { cn, formatRelativeTime, getImageUrl } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Bookmark, Heart, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import UserAvatar from '../shared/user-avatar';
import { Button } from '../ui/button';
import { Dialog, DialogContent } from '../ui/dialog';
import { Input } from '../ui/input';

export function PostModal({
  post: initialPost,
  open,
  onOpenChange,
}: PostModalProps) {
  const trpc = useTRPC();
  const { data: allPosts } = useQuery(
    trpc.postsRouter.findAll.queryOptions({}),
  );
  const post = allPosts?.find((p) => p.id === initialPost.id) || initialPost;
  const [commentText, setCommentText] = useState('');
  const { data: comments = [] } = useQuery(
    trpc.commentsRouter.findByPostId.queryOptions({
      postId: post.id,
    }),
  );
  const { data: session } = authClient.useSession();

  const { deleteComment, addComment, toggleLike, toggleBookmark } =
    usePostActions();

  const handleDeleteComment = async (commentId: number) => {
    await deleteComment.mutateAsync({ commentId });
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      await addComment.mutateAsync({
        postId: post.id,
        text: commentText,
      });
      setCommentText('');
    }
  };

  const handleLike = async () => {
    await toggleLike.mutateAsync({ postId: post.id });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={(isOpen) => {
        if (!isOpen) setCommentText('');
      }}
    >
      <DialogContent className='max-w-5xl! w-full h-[90vh] p-0 overflow-hidden flex flex-col'>
        <div className='grid md:grid-cols-[1.5fr_1fr] h-full flex-1 overflow-hidden'>
          <div className='relative bg-black flex items-center justify-center min-h-0'>
            <div className='relative w-full h-full'>
              <Image
                src={getImageUrl(post.image)}
                alt={post.caption}
                fill
                className='object-contain'
                sizes='(max-width: 768px) 100vw, 50vw'
              />
            </div>
          </div>

          <div className='flex flex-col h-full bg-background'>
            <div className='flex items-center justify-between p-4 border-b'>
              <div className='flex items-center space-x-3 h-auto p-0'>
                <UserAvatar
                  avatar={getImageUrl(post.user.avatar)}
                  username={post.user.username}
                  width={40}
                  height={40}
                  className='size-10'
                  iconClassName='size-5'
                  userId={post.user.id}
                />

                <Link href={`/users/${post.user.id}`} className='font-semibold'>
                  {post.user.username}
                </Link>
              </div>
            </div>

            <div className='flex-1 overflow-y-auto p-4'>
              <div className='flex space-x-3 mb-4'>
                <UserAvatar
                  avatar={getImageUrl(post.user.avatar)}
                  username={post.user.username}
                  userId={post.user.id}
                />

                <div className='flex-1'>
                  <div className='space-y-1'>
                    <div>
                      <Link
                        href={`/users/${post.user.id}`}
                        className='font-semibold mr-2'
                      >
                        {post.user.username}
                      </Link>
                      <span className='text-sm'>{post.caption}</span>
                    </div>

                    <div className='text-xs text-muted-foreground'>
                      {formatRelativeTime(post.createdAt)}
                    </div>
                  </div>
                </div>
              </div>

              <div className='space-y-3'>
                {comments.map((comment) => (
                  <div key={comment.id} className='flex items-start space-x-2'>
                    <UserAvatar
                      avatar={getImageUrl(comment.user.avatar)}
                      username={comment.user.username}
                      userId={comment.user.id}
                    />
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-start justify-between gap-2'>
                        <div className='flex-1 min-w-0'>
                          <Link
                            href={`/users/${comment.user.id}`}
                            className='font-semibold text-sm'
                          >
                            {comment.user.username}
                          </Link>
                          <p className='text-sm wrap-break-word'>
                            {comment.text}
                          </p>
                          <p className='text-xs text-muted-foreground mt-1'>
                            {formatRelativeTime(comment.createdAt)}
                          </p>
                        </div>
                        {session?.user.id === comment.user.id && (
                          <Button
                            variant='ghost'
                            size='sm'
                            className='p-1 h-auto shrink-0'
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            <Trash2 className='size-3 text-muted-foreground' />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {comments.length === 0 && (
                  <p className='text-sm text-muted-foreground text-center p-4'>
                    No comments yet. Be the first to comment!
                  </p>
                )}
              </div>
            </div>

            <div className='border-t p-4'>
              <div className='flex items-center justify-between mb-2'>
                <div className='flex items-center space-x-4'>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={handleLike}
                    disabled={toggleLike.isPending}
                    className='p-0 h-auto'
                  >
                    <Heart
                      className={`size-6 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`}
                    />
                  </Button>
                  <div className='font-semibold text-sm'>
                    {post.likes} likes
                  </div>
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => toggleBookmark.mutate({ postId: post.id })}
                  disabled={toggleBookmark.isPending}
                  className='p-0 h-auto'
                >
                  <Bookmark
                    className={cn('size-6', post.isSaved && 'fill-foreground')}
                  />
                </Button>
              </div>

              <div className='border-t p-4'>
                <form
                  onSubmit={handleAddComment}
                  className='flex items-center space-x-2'
                >
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
