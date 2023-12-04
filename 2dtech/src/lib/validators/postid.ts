import { z } from "zod";

export const PostValidator = z.object({
  postId: z.any(),
  subredditName: z.any(),
});

export type PostDeleteRequest = z.infer<typeof PostValidator>;
