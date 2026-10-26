'use client';

import { authClient } from '@/lib/auth/client';
import { useTRPC } from '@/lib/trpc/client';
import { cn, getImageUrl } from '@/lib/utils';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import UserAvatar from '../shared/user-avatar';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import StoryUpload from './story-upload';
import { StoryViewer } from './story-viewer';

const Stories = () => {
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const [showCreateStory, setShowCreateStory] = useState(false);
  const { data: session } = authClient.useSession();
  const trpc = useTRPC();
  const { data: storyGroups } = useSuspenseQuery(
    trpc.storiesRouter.getStories.queryOptions(),
  );

  const ownStoryGroup = storyGroups.find(
    (group) => group.userId === session?.user.id,
  );

  const otherStoryGroups = storyGroups.filter(
    (group) => group.userId !== session?.user.id,
  );

  const orderedStoryGroups = ownStoryGroup
    ? [ownStoryGroup, ...otherStoryGroups]
    : otherStoryGroups;

  const queryClient = useQueryClient();
  const uploadStory = useMutation(
    trpc.storiesRouter.create.mutationOptions({
      onSettled: () =>
        queryClient.invalidateQueries({
          queryKey: trpc.storiesRouter.getStories.queryKey(),
        }),
    }),
  );

  const handleUploadStory = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error('Failed to upload image');
    }

    const { filename } = await res.json();

    await uploadStory.mutateAsync({
      image: filename,
    });
  };

  return (
    <Card className='p-4'>
      <div className='flex space-x-4 overflow-x-auto scrollbar-hide pb-2'>
        <div className='flex flex-col items-center space-y-1 shrink-0'>
          <div className='relative'>
            <div
              className={cn(
                'p-0.5 rounded-full',
                ownStoryGroup
                  ? 'bg-linear-to-tr from-yellow-600 to-fuchsia-600'
                  : 'bg-gray-200',
              )}
              onClick={() => {
                if (ownStoryGroup) {
                  setSelectedGroupIndex(0);
                  setShowStoryViewer(true);
                }
              }}
            >
              <UserAvatar
                avatar={
                  session?.user.image ? getImageUrl(session.user.image) : null
                }
                className='size-16 border-2 border-white'
                iconClassName='size-6'
              />
            </div>
            <Button
              onClick={() => setShowCreateStory(true)}
              size='icon'
              className='absolute bottom-0 right-0 size-5 rounded-full border-2 border-white'
            >
              <Plus className='size-3' />
            </Button>
          </div>
          <span
            className='text-xs w-16 truncate text-center'
            title='Your story'
          >
            Your story
          </span>
        </div>
        {otherStoryGroups?.map((storyGroup, index) => (
          <div
            className='flex flex-col items-center space-y-1 shrink-0'
            key={storyGroup.userId}
            onClick={() => {
              setSelectedGroupIndex(ownStoryGroup ? index + 1 : index);
              setShowStoryViewer(true);
            }}
          >
            <div className='relative'>
              <div className='p-0.5 rounded-full bg-linear-to-tr from-yellow-600 to-fuchsia-600 bg-gray-200'>
                <UserAvatar
                  avatar={getImageUrl(storyGroup.avatar)}
                  username={storyGroup.username}
                  className='size-16 border-2 border-white'
                />
              </div>
            </div>
            <span
              className='text-xs w-16 truncate text-center'
              title={storyGroup.username}
            >
              {storyGroup.username}
            </span>
          </div>
        ))}
      </div>
      <StoryUpload
        open={showCreateStory}
        onOpenChange={setShowCreateStory}
        onSubmit={handleUploadStory}
      />
      <StoryViewer
        open={showStoryViewer}
        onOpenChange={setShowStoryViewer}
        initialGroupIndex={selectedGroupIndex}
        storyGroups={orderedStoryGroups}
      />
    </Card>
  );
};

export default Stories;
