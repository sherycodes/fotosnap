import { ProfileTabsProps } from '@/lib/types';
import { Bookmark, Grid } from 'lucide-react';
import EmptyState from '../shared/empty-state';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { PostsGrid } from './posts-grid';

export function ProfileTabs({
  userPosts,
  bookmarks,
  name,
  isOwnProfile,
  onPostClick,
}: ProfileTabsProps) {
  return (
    <Tabs defaultValue='posts' className='w-full'>
      <TabsList className='w-full justify-start border-t'>
        <TabsTrigger value='posts' className='gap-2'>
          <Grid className='size-4' />
          POSTS
        </TabsTrigger>
        {isOwnProfile && (
          <TabsTrigger value='saved' className='gap-2'>
            <Bookmark className='size-4' />
            SAVED
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value='posts' className='mt-6'>
        {userPosts.length === 0 ? (
          <EmptyState
            icon={Grid}
            title='No Posts Yet'
            description={`When ${name} shares photos, they'll appear here`}
          />
        ) : (
          <PostsGrid posts={userPosts} onPostClick={onPostClick} />
        )}
      </TabsContent>
      {isOwnProfile && (
        <TabsContent value='saved' className='mt-6'>
          {bookmarks.length === 0 ? (
            <EmptyState
              icon={Bookmark}
              title='No Saved Posts'
              description='Save photos and videos to see them here'
            />
          ) : (
            <PostsGrid posts={bookmarks} onPostClick={onPostClick} />
          )}
        </TabsContent>
      )}
    </Tabs>
  );
}
