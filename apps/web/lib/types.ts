import {
  Post,
  StoryGroup,
  UpdateProfileInput,
  UserProfile,
} from '@repo/trpc/schemas';
import { LucideIcon } from 'lucide-react';

export interface Story {
  id: string;
  username: string;
  avatar: string;
}

export interface UserAvatarProps {
  avatar: string | null;
  username?: string;
  userId?: string;
  className?: string;
  width?: number;
  height?: number;
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

export interface ProfileHeaderProps {
  profile: UserProfile;
  onFollowToggle: () => void;
  onEditProfile: () => void;
  isFollowLoading: boolean;
}

export interface PostGridProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
}

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
}

export interface ProfileTabsProps {
  userPosts: Post[];
  savedPosts: Post[];
  name: string;
  onPostClick: (post: Post) => void;
}

export interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: UserProfile;
  onSave: (updates: UpdateProfileInput) => void;
}
