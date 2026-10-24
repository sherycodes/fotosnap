'use client';

import { authClient } from '@/lib/auth/client';
import { mockStories } from '@/lib/constants';
import { getImageUrl } from '@/lib/utils';
import UserAvatar from '../shared/user-avatar';
import { Card } from '../ui/card';

const Stories = () => {
  const { data: session } = authClient.useSession();
  return (
    <Card className='p-4'>
      <div className='flex space-x-4 overflow-x-auto scrollbar-hide pb-2'>
        <div className='flex flex-col items-center space-y-1 shrink-0'>
          <div className='relative'>
            <div className='p-0.5 rounded-full bg-linear-to-tr from-yellow-600 to-fuchsia-600 bg-gray-200'>
              <UserAvatar
                avatar={
                  session?.user.image ? getImageUrl(session.user.image) : null
                }
                className='size-16 border-2 border-white'
                iconClassName='size-6'
              />
            </div>
          </div>
          <span
            className='text-xs w-16 truncate text-center'
            title='Your story'
          >
            Your story
          </span>
        </div>
        {mockStories.map(({ id, username, avatar }) => (
          <div
            className='flex flex-col items-center space-y-1 shrink-0'
            key={id}
          >
            <div className='relative'>
              <div className='p-0.5 rounded-full bg-linear-to-tr from-yellow-600 to-fuchsia-600 bg-gray-200'>
                <UserAvatar
                  avatar={avatar}
                  username={username}
                  className='size-16 border-2 border-white'
                />
              </div>
            </div>
            <span
              className='text-xs w-16 truncate text-center'
              title={username}
            >
              {username}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default Stories;
