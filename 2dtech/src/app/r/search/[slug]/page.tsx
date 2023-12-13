import PostFind from "@/components/PostFind";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    slug: string;
  };
}

const page = async ({ params }: PageProps) => {
  const { slug } = params;

  try {
    const posts = await db.post.findMany({
      where: {
        title: {
          contains: slug,
        },
        flag: "ok",
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
      // take: INFINITE_SCROLL_PAGINATION_RESULTS,
    });
    // const {data: posts} = await axios.get(`/api/posts/find?q=${slug}`);
    // console.log(`/api/posts/find?q=${slug}`);

    if (!posts.length)
      return (
        <>
          <h1 className="font-bold text-3xl md:text-4xl h-14">
            No articles found related to `{slug}`
          </h1>
        </>
      );

    return (
      <>
        <h1 className="font-bold text-3xl md:text-4xl h-14">
          Result post for `{slug}`
        </h1>
        {/* <MiniCreatePost session={session} /> */}
        {/* Show posts in user feed */}
        <PostFind initialPosts={posts} />
        {/* <h1>Done</h1> */}
      </>
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return notFound();
  }
};

export default page;
