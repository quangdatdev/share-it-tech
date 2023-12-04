"use client";
import { FC } from "react";
import { Button } from "./ui/Button";
import { CornerDownRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface TopicTrendProps {}

const TopicTrend: FC<TopicTrendProps> = ({}) => {
  const router = useRouter();
  const handleTopicClick = (topic: string) => {
    console.log("Selected topic:", topic);

    router.push(`/r/search/${encodeURIComponent(topic.toLowerCase())}`);
  };

  const topics = ["Java", "ReactJs", "Python", "Post"];

  return (
    <div className="flex flex-col gap-y-2">
      {topics.map((topic, index) => (
        <div className="space-y-2" key={index}>
          <Button
            key={topic}
            onClick={() => handleTopicClick(topic)}
            variant="ghost"
            size="xs"
          >
            <CornerDownRightIcon className="h-4 w-4 mr-1.5" /> {topic}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default TopicTrend;
