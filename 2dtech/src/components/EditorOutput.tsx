"use client";

import CustomCodeRenderer from "@/components/renderers/CustomCodeRenderer";
import CustomImageRenderer from "@/components/renderers/CustomImageRenderer";
import { FC } from "react";
import dynamic from "next/dynamic";

const Output = dynamic(
    async () => (await import("editorjs-react-renderer")).default,
    { ssr: false }
);

interface EditorOutputProps {
    content: any;
}

const renderers = {
    image: CustomImageRenderer,
    code: CustomCodeRenderer,
};

const style = {
    paragraph: {
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
    },
};

function getVideoTypeFromUrl(videoUrl: string) {
    let url = new URL(videoUrl);
    let path = url.pathname;
    let videoExtension = path.split(".").pop();
    return videoExtension;
}

const EditorOutput: FC<EditorOutputProps> = ({ content }: { content: any }) => {
    if (content.blocks[0].type === "video") {
        return <VideoComponent content={content} />;
    }
    return (
        <Output
            style={style}
            className="text-sm"
            renderers={renderers}
            data={content}
        />
    );
};

export default EditorOutput;

const VideoComponent = ({ content }: { content: any }) => {
    return (
        <figure className="relative flex flex-col justify-center items-center my-5 mx-0 w-full max-w-full overflow-hidden border-0">
            <video className="w-full" controls>
                <source
                    src={`${content.blocks[0].data.file.url}`}
                    type={`video/${getVideoTypeFromUrl(
                        content.blocks[0].data.file.url
                    )}`}
                />
                Your browser does not support the video tag.
            </video>
            <figcaption
                style={{
                    backgroundColor: "rgb(45, 51, 58)",
                }}
                className="absolute top-2 right-2 py-[5px] px-[10px] text-xs text-white rounded-[2px] cursor-default"
            >
                video test
            </figcaption>
        </figure>
    );
};
