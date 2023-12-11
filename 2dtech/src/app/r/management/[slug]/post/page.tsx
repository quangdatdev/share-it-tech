
import PostTemp from "@/components/admin/PostTemp";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface PageProps {
    params: {
      slug: string;
    };
  }

const page = async ({params} : PageProps) => {
    const { slug } = params;
  try {
    const posts = await db.post.findMany({
        where:{
            subreddit:{
                name: slug,
            },
            flag: null,
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
        take: 5,
      });


    if (!posts.length)
      return (
        <>
          <h1 className="font-bold text-3xl md:text-4xl h-14">
            No post for temp to can
          </h1>
        </>
      );

      return (
            <>
              <PostTemp initialPosts={posts} />
            </>
          
        
      );

  } catch (error) {
    console.error("Error fetching posts:", error);
    return notFound();
  }
};

export default page;
