"use client";

import { useRouter } from "next/navigation";
import { FC, startTransition } from "react";
import { Button } from "../ui/Button";
import { ChevronLeft, ThumbsUp } from "lucide-react";
import {  PostFlagRequest } from "@/lib/validators/postid";
import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

interface ButtonYesProps {
  postId: string;
}

const ButtonYes: FC<ButtonYesProps> = ({ postId }) => {
  const router = useRouter();
  const { mutate: removePost } = useMutation({
    mutationFn: async () => {
      const payload: PostFlagRequest = {
        postId, // Truyền postId vào payload
      };
      const { data } = await axios.post("/api/subreddit/post/update", payload); // Thay đổi đường dẫn API và payload
      return data as string;  
    },
    
    onError: (err) => {
      console.log("err: ", err);
      console.log("postid: ", postId);
      return toast({
        title: "There was a problem.",
        description: "Something went wrong, please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });
      return toast({
        title: "Updated",
        description: "Post updated successfully.",
      });
    },
  });
  return (
    <div className="flex flex-col gap-y-2">
      <div className="space-y-2">
        <Button
          // key={credit}
          // isLoading={isRemoveLoading}
          onClick={() => removePost()}
          variant="ghost"
          size="xs"
        >
          <ThumbsUp className="h-4 w-4 mr-1" />
        </Button>
      </div>
    </div>
  );
};

export default ButtonYes;
