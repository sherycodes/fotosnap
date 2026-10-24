export interface Story {
  id: string;
  username: string;
  avatar: string;
}

export interface UserAvatarProps {
  avatar: string | null;
  username?: string;
  className?: string;
  iconClassName?: string;
}
