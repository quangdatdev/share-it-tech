"use client";

import { ExtendedPost } from "@/types/db";
import { useIntersection } from "@mantine/hooks";
import { FC, useRef } from "react";
import PostCustom from "./PostCustom";
import ButtonYes from "./ButtonYes";
import RemoveTemp from "./RemoveTemp";

interface PostTempProps {
    initialPosts: ExtendedPost[];
}

const PostTemp: FC<PostTempProps> = ({ initialPosts }) => {
    const lastPostRef = useRef<HTMLElement>(null);
    const { ref } = useIntersection({
        root: lastPostRef.current,
        threshold: 1,
    });

    const posts = initialPosts;

    return (
        <ul className="flex flex-col col-span-2 space-y-6">
            {posts.map((post) => (
                <li key={post.id} ref={ref}>
                    <PostCustom
                        post={post}
                        subredditName={post.subreddit.name}
                    />
                     <div className="flex space-x-4">
            <ButtonYes postId={post.id} />
            <RemoveTemp postId={post.id} />
          </div>
                </li>
            ))}
        </ul>
    );
};

export default PostTemp;
``