"use client";

import { FC } from "react";
import { ExtendedPost } from "@/types/db";
import Post from "./Post";
import { useSession } from "next-auth/react";

interface PostFindProps {
  initialPosts: ExtendedPost[];
  subredditName?: string;
}

const PostFind: FC<PostFindProps> = ({ initialPosts, subredditName }) => {
  const posts = initialPosts;
  const { data: session } = useSession();
  return (
    <ul className="flex flex-col col-span-2 space-y-6">
      {posts.map((post, index) => {
        const votesAmt = post.votes.reduce((acc, vote) => {
          if (vote.type === "UP") return acc + 1;
          if (vote.type === "DOWN") return acc - 1;
          return acc;
        }, 0);

        const currentVote = post.votes.find(
          (vote) => vote.userId === session?.user.id
        );

        return (
          <li key={post.id}>
            <Post
              currentVote={currentVote}
              votesAmt={votesAmt}
              commentAmt={post.comments.length}
              post={post}
              subredditName={post.subreddit.name}
            />
          </li>
        );
      })}
    </ul>
  );
};

export default PostFind;
