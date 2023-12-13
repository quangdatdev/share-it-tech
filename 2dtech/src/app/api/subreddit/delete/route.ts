import { db } from "@/lib/db";
import { SubredditSubscriptionValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { subredditId } = SubredditSubscriptionValidator.parse(body);

    const existingSubreddit = await db.subreddit.findUnique({
      where: { id: subredditId },
    });

    if (!existingSubreddit) {
      return new Response("Subreddit not found.", { status: 404 });
    }

    await db.subscription.deleteMany({
      where: {
        subredditId: subredditId,
      },
    });

    await db.post.deleteMany({
      where: {
        subredditId: subredditId,
      },
    });

    await db.subreddit.delete({
      where: {
        id: subredditId,
      },
    });

    return new Response(`Subreddit ${subredditId} deleted.`);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed.", { status: 422 });
    }

    // Xử lý các lỗi khác, có thể in log để theo dõi
    console.error("Error deleting subreddit:", error);

    return new Response("Không thể xóa subreddit", {
      status: 500,
    });
  }
}
