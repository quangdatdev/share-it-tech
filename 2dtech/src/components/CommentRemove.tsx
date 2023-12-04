"use client";
import { FC, startTransition } from "react";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Trash2Icon } from "lucide-react";
import { CommentRequestRemove } from "@/lib/validators/comment";

interface CommentRemoveProps {
  postId: string;
  id: string;
}

const CommentRemove: FC<CommentRemoveProps> = ({ postId, id }) => {
  const { loginToast } = useCustomToast();
  const router = useRouter();
  const { mutate: removeComment, isLoading: isRemoveLoading } = useMutation({
    mutationFn: async () => {
      const payload: CommentRequestRemove = {
        postId, // Truyền postId vào payload
        id,
      };

      const { data } = await axios.post(
        "/api/subreddit/post/comment/delete",
        payload
      ); // Thay đổi đường dẫn API và payload
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
        router.refresh();
        // router.push(`/r/${id}`);
      });
      return toast({
        title: "Removed",
        description: "Comment removed successfully.",
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
          onClick={() => removeComment()}
        >
          <Trash2Icon className="h-4 w-4 mr-1.5" />
        </Button>
      </div>
    </>
  );
};

export default CommentRemove;
