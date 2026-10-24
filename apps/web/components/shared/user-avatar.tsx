import { UserAvatarProps } from '@/lib/types';
import { cn } from 'cn';
import { User } from 'lucide-react';
import Image from 'next/image';

const UserAvatar = ({
  avatar,
  username,
  className,
  iconClassName,
}: UserAvatarProps) => {
  return avatar ? (
    <Image
      src={avatar}
      alt={username || 'My Profile Picture'}
      width={64}
      height={64}
      className={cn('size-8 rounded-full', className)}
    />
  ) : (
    <div
      className={cn(
        'size-8 rounded-full bg-muted flex items-center justify-center',
        className
      )}
    >
      <User className={cn('size-4 text-muted-foreground', iconClassName)} />
    </div>
  );
};

export default UserAvatar;
