import { db } from "@/lib/db";
import { User, columns } from "./columns";

import { notFound } from "next/navigation";
import { DataTable } from "@/components/DataTable";

async function getData(subredditName: string): Promise<User[]> {
  const subreddit = await db.subreddit.findFirst({
    where: {
      name: subredditName,
    },
  });

  if (!subreddit) {
    // Handle the case when the subreddit is not found
    return [];
  }

  const subscriptions = await db.subscription.findMany({
    where: {
      subreddit,
    },
    include: {
      user: true,
      subreddit: true,
    },
  });

  // Filter out users who are the creators (authors) of the subreddit
  const members = subscriptions.filter(
    (subscription) => subscription.user.id !== subscription.subreddit.creatorId
  );

  // Convert the data to the desired format (User[])
  const data: User[] = await Promise.all(
    members.map(async (sub) => {
      const postCount = await db.post.count({
        where: {
          authorId: sub.user.id,
          subredditId: sub.subreddit.id,
        },
      });

      return {
        id: sub.user.id.toString() || "",
        name: sub.user.name || "",
        username: sub.user.username || "",
        email: sub.user.email || "",
        postCount,
        subredit: sub.subreddit.id,
      };
    })
  );

  return data;
}

interface PageProps {
  params: {
    slug: string;
  };
}

const page = async ({ params }: PageProps) => {
  const { slug } = params;
  try {
    const users = await getData(slug);

    if (!users.length)
      return (
        <>
          <h1 className="font-bold text-3xl md:text-4xl h-14">
            No articles found related to `{slug}`
          </h1>
        </>
      );

    return (
      <>
        <div className="container mx-auto py-10">
          <h1 className="mb-6 text-3xl font-bold">All user</h1>

          <DataTable columns={columns} data={users} />
        </div>
      </>
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return notFound();
  }
};

export default page;
