import { authClient } from '@/lib/auth/client';
import { useTRPC } from '@/lib/trpc/client';
import { FollowersFollowingModalProps } from '@/lib/types';
import { getImageUrl } from '@/lib/utils';
import { useFollowActions } from '@/hooks/useFollowActions';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import UserAvatar from '../shared/user-avatar';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Spinner } from '../ui/spinner';

export function FollowersFollowingModal({
  open,
  onOpenChange,
  userId,
  type,
}: FollowersFollowingModalProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const trpc = useTRPC();
  const { data: followers = [], isPending: followersPending } = useQuery(
    trpc.usersRouter.getFollowers.queryOptions(
      {
        userId,
      },
      {
        enabled: open && type === 'followers',
      },
    ),
  );
  const { data: following = [], isPending: followingPending } = useQuery(
    trpc.usersRouter.getFollowing.queryOptions(
      {
        userId,
      },
      {
        enabled: open && type === 'following',
      },
    ),
  );
  const { follow, unfollow } = useFollowActions();

  const users = type === 'followers' ? followers : following;
  const isLoading = type === 'followers' ? followersPending : followingPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-106.25'>
        <DialogHeader>
          <DialogTitle>
            {type === 'followers' ? 'Followers' : 'Following'}
          </DialogTitle>
        </DialogHeader>
        <div className='max-h-[60vh] overflow-y-auto'>
          {isLoading ? (
            <div className='flex justify-center py-8'>
              <Spinner className='size-6 text-muted-foreground' />
            </div>
          ) : users.length === 0 ? (
            <p className='text-center text-muted-foreground py-8'>
              No {type === 'followers' ? 'followers' : 'following'} yet
            </p>
          ) : (
            <div className='space-y-3'>
              {users.map((user) => (
                <div
                  key={user.id}
                  className='flex items-center justify-between'
                >
                  <Button
                    variant='ghost'
                    onClick={() => {
                      router.push(`/users/${user.id}`);
                      onOpenChange(false);
                    }}
                    className='flex items-center space-x-3 flex-1 h-auto p-0 justify-start'
                  >
                    <UserAvatar
                      avatar={getImageUrl(user.image)}
                      username={user.name}
                      width={40}
                      height={40}
                      className='size-10'
                      iconClassName='size-5'
                    />

                    <div className='flex-1 min-w-0 text-left'>
                      <div className='font-semibold text-sm truncate'>
                        {user.name}
                      </div>
                      {user.bio && (
                        <div className='text-xs text-muted-foreground truncate'>
                          {user.bio}
                        </div>
                      )}
                    </div>
                  </Button>
                  {session?.user.id !== user.id && (
                    <Button
                      variant={user.isFollowing ? 'outline' : 'default'}
                      size={'sm'}
                      onClick={() => {
                        if (user.isFollowing) {
                          unfollow.mutate({ userId: user.id });
                        } else {
                          follow.mutate({ userId: user.id });
                        }
                      }}
                      disabled={
                        (follow.isPending &&
                          follow.variables?.userId === user.id) ||
                        (unfollow.isPending &&
                          unfollow.variables?.userId === user.id)
                      }
                      className='shrink-0'
                    >
                      {user.isFollowing ? 'Unfollow' : 'Follow'}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
