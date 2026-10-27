import { ProfileHeaderProps } from '@/lib/types';
import { getImageUrl } from '@/lib/utils';
import { Edit, Globe, Settings } from 'lucide-react';
import UserAvatar from '../shared/user-avatar';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export default function ProfileHeader({
  profile,
  onFollowToggle,
  isFollowLoading,
}: ProfileHeaderProps) {
  return (
    <div className='mb-8'>
      <div className='flex flex-col md:flex-row gap-8 items-start md:items-center'>
        <div className='shrink-0'>
          <UserAvatar
            avatar={getImageUrl(profile.image)}
            username={profile.name}
            width={150}
            height={150}
            className='size-32 md:w-40 md:h-40 object-cover border-2'
            iconClassName='size-16'
          />
        </div>

        <div className='flex-1 space-y-4'>
          <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
            <h1 className='text-2xl font-normal'>{profile.name}</h1>
            <div className='flex gap-2'>
              <Button
                onClick={onFollowToggle}
                disabled={isFollowLoading}
                variant={profile.isFollowing ? 'outline' : 'default'}
              >
                {profile.isFollowing ? 'Following' : 'Follow'}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={<Button variant='outline' size='icon' />}
                >
                  <Settings className='size-4' />
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem onClick={() => {}}>
                    <Edit className='size-4 mr-2' />
                    Edit Profile
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className='flex gap-8 text-sm'>
            <div>
              <span className='font-semibold'>{profile.postCount}</span>{' '}
              <span className='text-muted-foreground'>posts</span>
            </div>
            <Button variant='ghost' onClick={() => {}} className='h-auto p-0'>
              <span className='font-semibold'>{profile.followerCount}</span>{' '}
              <span className='text-muted-foreground'>followers</span>
            </Button>
            <Button variant='ghost' onClick={() => {}} className='h-auto p-0'>
              <span className='font-semibold'>{profile.followingCount}</span>{' '}
              <span className='text-muted-foreground'>following</span>
            </Button>
          </div>

          <div className='space-y-1'>
            {profile.bio && (
              <div className='text-sm whitespace-pre-wrap'>{profile.bio}</div>
            )}
            {profile.website && (
              <a
                href={profile.website}
                target='_blank'
                className='text-sm text-primary hover:underline flex items-center gap-1'
              >
                <Globe className='size-3' />
                {profile.website}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
