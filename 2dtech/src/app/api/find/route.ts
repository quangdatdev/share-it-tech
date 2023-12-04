import { db } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q");
  // console.log(q);

  if (!q) {
    return new Response("Invalid query", { status: 400 });
  }

  const posts = await db.post.findMany({
    where: {
      title: {
        contains: q,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      subreddit: true,
    },
    take: 2,
  });

  return new Response(JSON.stringify(posts));
}
