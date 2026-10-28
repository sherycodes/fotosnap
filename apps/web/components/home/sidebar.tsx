'use client';

import { authClient } from '@/lib/auth/client';
import { mockSuggestions } from '@/lib/constants';
import { useTRPC } from '@/lib/trpc/client';
import { getImageUrl } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { Camera, LogOut } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AvatarUpload from '../modals/avatar-upload';
import UserAvatar from '../shared/user-avatar';
import { ThemeToggle } from '../theme/theme-toggle';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

export default function Sidebar() {
  const { data: session } = authClient.useSession();
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/login');
  };

  const handleAvatarUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const uploadResponse = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload avatar');
    }

    const { filename } = await uploadResponse.json();
    await authClient.updateUser({ image: filename });
    await queryClient.invalidateQueries({
      queryKey: trpc.postsRouter.findAll.queryKey(),
    });
  };

  return (
    <div className='space-y-6'>
      <Card className='p-4'>
        <div className='flex items-center space-x-3 mb-4'>
          <div className='relative'>
            <UserAvatar
              avatar={
                session?.user.image ? getImageUrl(session.user.image) : null
              }
              userId={session?.user.id}
              className='size-16'
              iconClassName='size-6'
            />

            <Button
              size='icon'
              onClick={() => setShowAvatarModal(true)}
              title='Change avatar'
              className='absolute -bottom-1 -right-1 size-6 rounded-full p-1'
            >
              <Camera className='size-3' />
            </Button>
          </div>

          <div className='flex-1 min-w-0'>
            <div className='font-semibold truncate'>{session?.user.email}</div>
            <div className='text-sm text-muted-foreground truncate'>
              {session?.user.name}
            </div>
          </div>
          <div className='flex items-center gap-1 sm:gap-2 shrink-0'>
            <ThemeToggle />
            <Button
              variant='ghost'
              size='icon'
              className='text-muted-foreground hover:text-foreground'
              onClick={handleLogout}
              title='Sign Out'
            >
              <LogOut className='size-4' />
            </Button>
          </div>
        </div>
      </Card>

      <Card className='p-4'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='font-semibold text-muted-foreground'>
            Suggestions for you
          </h3>
        </div>

        <div className='space-y-3'>
          {mockSuggestions.map((user) => (
            <div key={user.id} className='flex items-center space-x-3'>
              <Image
                src={user.avatar}
                alt={user.username}
                className='size-8 rounded-full'
                width={40}
                height={40}
              />
              <div className='flex-1 min-w-0'>
                <div className='font-semibold text-sm'>{user.username}</div>
                {user.followedBy && (
                  <div className='text-xs text-muted-foreground'>
                    Followed by {user.followedBy}
                  </div>
                )}
              </div>
              <Button
                variant='ghost'
                size='sm'
                className='text-primary hover:text-primary/90 text-xs'
              >
                Follow
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <AvatarUpload
        open={showAvatarModal}
        onOpenChange={setShowAvatarModal}
        onSubmit={handleAvatarUpload}
        currentAvatar={session?.user.image}
      />
    </div>
  );
}
