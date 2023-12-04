// Import các thư viện và dependencies cần thiết
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
// import { Request } from '@vercel/node';

// Định nghĩa schema cho request body nếu cần thiết
const CommentDeleteValidator = z.object({
  postId: z.string(),
  id: z.string(),
});

export async function POST(req: Request) {
  try {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Parse request body để lấy postId và id của comment
    const body = await req.json();
    const { postId, id } = CommentDeleteValidator.parse(body);

    // Kiểm tra xem comment có tồn tại không
    const comment = await db.comment.findFirst({
      where: {
        id: id,
        postId: postId,
        authorId: session.user.id,
      },
    });

    if (!comment) {
      return new Response(
        "You do not have permission to delete this comment or the comment does not exist.",
        {
          status: 403,
        }
      );
    }

    // Thực hiện xóa comment
    await db.comment.delete({
      where: {
        id: id,
      },
    });

    return new Response("Comment deleted successfully.");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed.", { status: 422 });
    }

    return new Response("Could not delete comment, please try again later.", {
      status: 500,
    });
  }
}
