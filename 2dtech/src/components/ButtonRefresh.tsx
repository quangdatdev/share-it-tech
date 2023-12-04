"use client";

import { useRouter } from "next/navigation";
import { FC } from "react";
import { Button } from "./ui/Button";
import { ChevronLeft } from "lucide-react";

interface ButtonRefreshProps {
  credit: string;
}

const ButtonRefresh: FC<ButtonRefreshProps> = ({ credit }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-y-2">
      <div className="space-y-2">
        <Button
          // key={credit}
          onClick={() => router.push(`/r/${credit}`)}
          variant="ghost"
          size="xs"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to {credit} post
        </Button>
      </div>
    </div>
  );
};

export default ButtonRefresh;
