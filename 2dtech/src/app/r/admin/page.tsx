import { db } from "@/lib/db";
import React from "react";
import { Subbredit, columns } from "./columns";
import { DataTable } from "@/components/admin/data-table";
import { getAuthSession } from "@/lib/auth";

async function getData(): Promise<Subbredit[]> {
  const allsubreddit = await db.subreddit.findMany({
    include: {
      Creator: true,
    },
  });
  console.log("sub: ", allsubreddit);

  const data: Subbredit[] = await Promise.all(
    allsubreddit.map(async (sub) => {
      const postCount = await db.post.count({
        where: {
          subredditId: sub.id,
        },
      });

      return {
        id: sub.id,
        name: sub.name,
        createdAt: sub.createdAt,
        creatorId: sub.Creator?.email,
        postCount,
      };
    })
  );
  console.log("data: ", data);

  return data;
}

const page = async () => {
  const session = await getAuthSession();

  if (session?.user.username !== "admin")
    return (
      <>
        <div className="container mx-auto py-10">
          <h1 className="mb-6 text-3xl font-bold">
            You do not have permission to access Community Management
            functionality
          </h1>
        </div>
      </>
    );
  else {
    const datasub = await getData();
    return (
      <>
        <div className="container mx-auto py-10">
          <h1 className="mb-6 text-3xl font-bold">All Community</h1>

          <DataTable columns={columns} data={datasub} />
        </div>
      </>
    );
  }
};

export default page;
