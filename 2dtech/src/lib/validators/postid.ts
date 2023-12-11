import { z } from "zod";

export const PostValidator = z.object({
  postId: z.any(),
  subredditName: z.any(),
});

export const PostValidator2 = z.object({
  postId: z.any(),
});

export type PostDeleteRequest = z.infer<typeof PostValidator>;
export type PostFlagRequest = z.infer<typeof PostValidator2>;
