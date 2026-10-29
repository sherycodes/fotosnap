'use client';

import { authClient } from '@/lib/auth/client';
import { useTRPC } from '@/lib/trpc/client';
import { uploadImage } from '@/lib/upload';
import { getImageUrl } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Camera, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AvatarUpload from '../modals/avatar-upload';
import UserAvatar from '../shared/user-avatar';
import { ThemeToggle } from '../theme/theme-toggle';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import Link from 'next/link';

export default function Sidebar() {
  const { data: session } = authClient.useSession();
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: suggestedUsers = [] } = useQuery(
    trpc.usersRouter.getSuggestedUsers.queryOptions(),
  );

  const followMutation = useMutation(
    trpc.usersRouter.follow.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.usersRouter.getSuggestedUsers.queryKey(),
        });
      },
    }),
  );

  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/login');
  };

  const handleAvatarUpload = async (file: File) => {
    const filename = await uploadImage(file);
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
          {suggestedUsers.length === 0 ? (
            <p className='text-sm text-muted-foreground'>
              No suggestions available
            </p>
          ) : (
            suggestedUsers.map((user) => (
              <div key={user.id} className='flex items-center justify-between'>
                <Link
                  href={`/users/${user.id}`}
                  className='flex items-center gap-3'
                >
                  <UserAvatar
                    avatar={getImageUrl(user.image)}
                    username={user.name}
                    width={40}
                    height={40}
                  />

                  <div className='min-w-0 text-left'>
                    <div className='font-semibold text-sm'>{user.name}</div>
                    {user.bio && (
                      <div className='text-xs text-muted-foreground truncate'>
                        {user.bio}
                      </div>
                    )}
                  </div>
                </Link>

                <Button
                  variant='ghost'
                  size='sm'
                  className='bg-primary text-muted hover:text-muted/90 hover:bg-primary/90 dark:hover:bg-primary/90 dark:hover:text-muted/90 text-xs'
                  onClick={() => followMutation.mutate({ userId: user.id })}
                  disabled={followMutation.isPending}
                >
                  Follow
                </Button>
              </div>
            ))
          )}
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
