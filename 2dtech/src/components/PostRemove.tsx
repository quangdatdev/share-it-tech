"use client";
import { FC, startTransition } from "react";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { PostDeleteRequest } from "@/lib/validators/postid";
import { Trash2Icon } from "lucide-react";

interface PostRemoveProps {
  postId: string;
  subredditName: string;
}

const PostRemove: FC<PostRemoveProps> = ({ postId, subredditName }) => {
  const { loginToast } = useCustomToast();
  const router = useRouter();
  const { mutate: removePost, isLoading: isRemoveLoading } = useMutation({
    mutationFn: async () => {
      const payload: PostDeleteRequest = {
        postId, // Truyền postId vào payload
        subredditName,
      };

      const { data } = await axios.post("/api/subreddit/post/delete", payload); // Thay đổi đường dẫn API và payload
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }
      return toast({
        title: "There was a problem.",
        description: "Something went wrong, please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        // router.refresh();
        router.push(`/r/${subredditName}`);
      });
      return toast({
        title: "Removed",
        description: "Post removed successfully.",
      });
    },
  });

  return (
    <>
      <div className="">
        <Button
          type="submit"
          className=""
          variant="outline"
          isLoading={isRemoveLoading}
          onClick={() => removePost()}
        >
          <Trash2Icon className="h-4 w-4 mr-1.5" />
        </Button>
      </div>
    </>
  );
};

export default PostRemove;
