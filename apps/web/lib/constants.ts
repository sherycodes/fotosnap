import { Story, SuggestedUser } from './types';

export const mockStories: Story[] = [
  {
    id: '1',
    username: 'johndoe',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face',
  },
  {
    id: '2',
    username: 'janedoe',
    avatar:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=60&h=60&fit=crop&crop=faces',
  },
  {
    id: '3',
    username: 'photographer',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
  },
  {
    id: '4',
    username: 'traveler',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face',
  },
  {
    id: '5',
    username: 'foodie',
    avatar:
      'https://images.unsplash.com/photo-1463453091185-61582044d556?w=60&h=60&fit=crop&crop=face',
  },
];

export const mockSuggestions: SuggestedUser[] = [
  {
    id: '1',
    username: 'alexsmith',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
    followedBy: 'johndoe',
  },
  {
    id: '2',
    username: 'sarahwilson',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face',
    followedBy: 'janedoe',
  },
  {
    id: '3',
    username: 'mikejohnson',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    followedBy: 'photographer',
  },
  {
    id: '4',
    username: 'emilydavis',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
    followedBy: 'photographer',
  },
  {
    id: '5',
    username: 'davidbrown',
    avatar:
      'https://images.unsplash.com/photo-1463453091185-61582044d556?w=40&h=40&fit=crop&crop=face',
    followedBy: 'traveler',
  },
];
