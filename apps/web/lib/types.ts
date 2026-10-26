import { StoryGroup } from '@repo/trpc/schemas';

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

export interface AvatarUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (file: File) => Promise<void>;
  currentAvatar?: string | null;
}

export interface SuggestedUser {
  id: string;
  username: string;
  avatar: string;
  followedBy: string;
}

export interface CommentsProps {
  postId: number;
  onAddComment: (text: string) => void;
  onDeleteComment: (commentId: number) => void;
}

export interface StoryUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (file: File) => Promise<void>;
}

export interface StoryViewerProps {
  storyGroups: StoryGroup[];
  open: boolean;
  initialGroupIndex: number;
  onOpenChange: (open: boolean) => void;
}
