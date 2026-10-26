import { StoryViewerProps } from '@/lib/types';
import { getImageUrl } from '@/lib/utils';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import UserAvatar from '../shared/user-avatar';
import { Button } from '../ui/button';
import { Dialog, DialogContent } from '../ui/dialog';

export const StoryViewer = ({
  storyGroups,
  open,
  onOpenChange,
  initialGroupIndex,
}: StoryViewerProps) => {
  const [currentGroupIndex, setCurrentGroupIndex] = useState(initialGroupIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const currentGroup = storyGroups[currentGroupIndex];
  const currentStory = currentGroup?.stories[currentStoryIndex];

  const handleNext = () => {
    if (!currentGroup) return;

    if (currentStoryIndex < currentGroup.stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setProgress(0);
    } else {
      setCurrentStoryIndex(0);
      setProgress(0);
    }
  };

  const handlePrevious = () => {
    if (!currentGroup) return;

    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
      setProgress(0);
    }
  };

  useEffect(() => {
    if (open) {
      setCurrentGroupIndex(initialGroupIndex);
      setCurrentStoryIndex(0);
      setProgress(0);
    }
  }, [open, initialGroupIndex]);

  useEffect(() => {
    if (!open || !currentStory) return;

    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentStory?.id, open]);

  const handleClose = () => {
    onOpenChange(false);
  };

  if (!currentGroup || !currentStory) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className='block h-[90vh] w-auto max-w-[calc(100vw-2rem)] sm:max-w-none aspect-9/16 p-0 overflow-hidden bg-black'
        showCloseButton={false}
      >
        <div className='relative size-full'>
          <div className='absolute top-0 left-0 right-0 z-20 flex gap-1 p-2'>
            {currentGroup.stories.map((story, index) => (
              <div
                key={story.id}
                className='flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden'
              >
                <div
                  className='h-full bg-white transition-all duration-100'
                  style={{
                    width:
                      index < currentStoryIndex
                        ? '100%'
                        : index === currentStoryIndex
                          ? `${progress}%`
                          : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          <div className='absolute top-4 left-0 right-0 z-20 flex items-center justify-between px-4 pt-2'>
            <button className='flex items-center space-x-3 hover:opacity-80 transition-opacity outline-none'>
              <UserAvatar
                avatar={getImageUrl(currentGroup.avatar)}
                username={currentGroup.username}
              />
              <div>
                <div className='text-white font-semibold text-sm'>
                  {currentGroup.username}
                </div>
              </div>
            </button>

            <div className='flex items-center gap-2'>
              <Button
                variant='ghost'
                size='icon'
                onClick={handleClose}
                className='text-white hover:bg-white/20'
              >
                <X className='size-5' />
              </Button>
            </div>
          </div>

          <Image
            src={getImageUrl(currentStory.image)}
            alt='Story'
            fill
            sizes='(max-width: 640px) 100vw, 50vh'
            className='object-contain'
          />

          {(currentGroupIndex > 0 || currentStoryIndex > 0) && (
            <Button
              variant='ghost'
              size='icon'
              onClick={handlePrevious}
              className='absolute left-2 top-1/2 -translate-y-1/2 z-20 text-white bg-black/50 hover:bg-black/70 transition-colors'
            >
              <ChevronLeft className='size-6' />
            </Button>
          )}
          <Button
            variant='ghost'
            size='icon'
            onClick={handleNext}
            className='absolute right-2 top-1/2 -translate-y-1/2 z-20 text-white bg-black/50 hover:bg-black/70 transition-colors'
          >
            <ChevronRight className='size-6' />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
