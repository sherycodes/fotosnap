import z from 'zod';

export const createPostSchema = z.object({
  image: z.string().min(1, 'Image is required'),
  caption: z.string().min(1, 'Caption is required'),
});

export const likePostSchema = z.object({
  postId: z.number(),
});

export const postSchema = z.object({
  id: z.number(),
  user: z.object({
    username: z.string(),
    avatar: z.string(),
  }),
  image: z.string(),
  caption: z.string(),
  likes: z.number(),
  comments: z.number(),
  createdAt: z.string(),
  isLiked: z.boolean().optional(),
});

export type Post = z.infer<typeof postSchema>;
export type CreatePost = z.infer<typeof createPostSchema>;
export type LikePost = z.infer<typeof likePostSchema>;
