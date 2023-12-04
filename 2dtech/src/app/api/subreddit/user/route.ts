import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditSubscriptionValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { subredditId } = SubredditSubscriptionValidator.parse(body);
    console.log(subredditId);

    // Lấy thông tin về tất cả các subscription trong subreddit
    const subscriptions = await db.subscription.findMany({
      where: {
        subredditId,
      },
      include: {
        user: true,
      },
    });

    const subreddit = await db.subreddit.findFirst({
      where: {
        id: subredditId,
      },
    });

    if (!subscriptions || subscriptions.length === 0) {
      return new Response("No subscribers found!", {
        status: 400,
      });
    }

    // Lọc ra những người dùng không phải là tác giả (creator) của subreddit
    const members = subscriptions.filter(
      (subscription) => subscription.user.id !== subreddit?.creatorId
    );

    // Kiểm tra xem người dùng hiện tại có phải là tác giả không
    const isSubredditCreator = members.some(
      (subscription) => subscription.user.id === session.user.id
    );

    if (isSubredditCreator) {
      return new Response("You can't unsubscribe from your own subreddit.", {
        status: 400,
      });
    }

    // Thực hiện các hành động khác tại đây, chẳng hạn như xóa subscription

    return new Response("Successfully processed the request!");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed.", { status: 422 });
    }

    return new Response("Could not unsubscribe, please try again later.", {
      status: 500,
    });
  }
}
