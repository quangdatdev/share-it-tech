// Import các thư viện và dependencies cần thiết
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

// Định nghĩa schema cho request body
const PostDeleteValidator = z.object({
  postId: z.string(),
});

export async function POST(req: Request) {
  try {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Parse request body để lấy postId
    const body = await req.json();
    const { postId } = PostDeleteValidator.parse(body);

    // Kiểm tra xem người dùng có quyền xóa bài post hay không
    const post = await db.post.findFirst({
      where: {
        id: postId,
        authorId: session.user.id,
      },
    });

    if (!post) {
      return new Response("You do not have permission to delete this post.", {
        status: 403,
      });
    }

    await db.comment.deleteMany({
      where: {
        postId: postId,
      },
    });

    // Thực hiện xóa bài post
    await db.post.delete({
      where: {
        id: postId,
      },
    });

    return new Response(postId);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed.", { status: 422 });
    }

    return new Response("Could not delete post, please try again later.", {
      status: 500,
    });
  }
}
