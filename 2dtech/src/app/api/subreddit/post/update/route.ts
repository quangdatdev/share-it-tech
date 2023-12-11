
import { db } from "@/lib/db";
import { PostValidator2 } from "@/lib/validators/postid";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { postId } = PostValidator2.parse(body);

    // update flag
    await db.post.update({
      where: {
        id: postId,
      },
      data: {
        flag: 'ok',
      },
    });

    return new Response("OK");
  } catch (error) {
    error;

    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response(
      "Could not update flag at this time. Please try later",
      { status: 500 }
    );
  }
}
