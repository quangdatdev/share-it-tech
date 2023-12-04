import { z } from "zod";

export const CommentValidator = z.object({
  postId: z.string(),
  text: z.string(),
  replyToId: z.string().optional(),
});

export type CommentRequest = z.infer<typeof CommentValidator>;

export const CommentIdVali = z.object({
  postId: z.string(),
  id: z.string(),
});

export type CommentRequestRemove = z.infer<typeof CommentIdVali>;
