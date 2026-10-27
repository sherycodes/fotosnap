import { UserAvatarProps } from '@/lib/types';
import { cn } from 'cn';
import { User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const UserAvatar = ({
  avatar,
  username,
  userId,
  width,
  height,
  className,
  iconClassName,
}: UserAvatarProps) => {
  const avatarElement = avatar ? (
    <Image
      src={avatar}
      alt={username || 'My Profile Picture'}
      width={width || 64}
      height={height || 64}
      className={cn('size-8 rounded-full object-cover', className)}
    />
  ) : (
    <div
      className={cn(
        'size-8 rounded-full bg-muted flex items-center justify-center',
        className,
      )}
    >
      <User className={cn('size-4 text-muted-foreground', iconClassName)} />
    </div>
  );

  if (!userId) return avatarElement;

  return (
    <Link
      href={`/users/${userId}`}
      aria-label={username ? `${username}'s profile` : 'View profile'}
      className='shrink-0 rounded-full hover:opacity-80 transition-opacity'
    >
      {avatarElement}
    </Link>
  );
};

export default UserAvatar;
