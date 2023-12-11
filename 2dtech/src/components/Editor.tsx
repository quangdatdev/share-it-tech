"use client";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useForm } from "react-hook-form";
import { PostCreationRequest, PostValidator } from "@/lib/validators/post";
import { zodResolver } from "@hookform/resolvers/zod";
import EditorJS from "@editorjs/editorjs";
import { uploadFiles } from "@/lib/uploadthing";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { z } from "zod";
import "@/styles/editor.css";

type FormData = z.infer<typeof PostValidator>;
interface EditorProps {
    subredditId: string;
}

const Editor: FC<EditorProps> = ({ subredditId }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PostCreationRequest>({
        resolver: zodResolver(PostValidator),
        defaultValues: {
            subredditId,
            title: "",
            content: null,
        },
    });

    const ref = useRef<EditorJS>();
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const _titleRef = useRef<HTMLTextAreaElement>(null);
    const pathname = usePathname();
    const router = useRouter();

    const initializeEditor = useCallback(async () => {
        const EditorJS = (await import("@editorjs/editorjs")).default;
        const Header = (await import("@editorjs/header")).default;
        const Embed = (await import("@editorjs/embed")).default;
        const Table = (await import("@editorjs/table")).default;
        const List = (await import("@editorjs/list")).default;
        const Code = (await import("@editorjs/code")).default;
        const LinkTool = (await import("@editorjs/link")).default;
        const InlineCode = (await import("@editorjs/inline-code")).default;
        const ImageTool = (await import("@editorjs/image")).default;

        class CustomVideoTool extends ImageTool {
            render() {
                const customRender = super.render();
                // Modify the HTML element containing "Select an image" text
                const imageInput = customRender.querySelector(".cdx-button");
                imageInput.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" fill="none"><path d="M16 10L18.5768 8.45392C19.3699 7.97803 19.7665 7.74009 20.0928 7.77051C20.3773 7.79703 20.6369 7.944 20.806 8.17433C21 8.43848 21 8.90095 21 9.8259V14.1741C21 15.099 21 15.5615 20.806 15.8257C20.6369 16.056 20.3773 16.203 20.0928 16.2295C19.7665 16.2599 19.3699 16.022 18.5768 15.5461L16 14M6.2 18H12.8C13.9201 18 14.4802 18 14.908 17.782C15.2843 17.5903 15.5903 17.2843 15.782 16.908C16 16.4802 16 15.9201 16 14.8V9.2C16 8.0799 16 7.51984 15.782 7.09202C15.5903 6.71569 15.2843 6.40973 14.908 6.21799C14.4802 6 13.9201 6 12.8 6H6.2C5.0799 6 4.51984 6 4.09202 6.21799C3.71569 6.40973 3.40973 6.71569 3.21799 7.09202C3 7.51984 3 8.07989 3 9.2V14.8C3 15.9201 3 16.4802 3.21799 16.908C3.40973 17.2843 3.71569 17.5903 4.09202 17.782C4.51984 18 5.07989 18 6.2 18Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Select a video`;
                return customRender;
            }
        }

        if (!ref.current) {
            const editor = new EditorJS({
                holder: "editor",
                onReady() {
                    ref.current = editor;
                },
                placeholder: "Type here to write your post...",
                inlineToolbar: true,
                data: { blocks: [] },
                tools: {
                    header: Header,
                    linkTool: {
                        class: LinkTool,
                        config: {
                            endpoint: "/api/link",
                        },
                    },
                    image: {
                        class: ImageTool,
                        config: {
                            uploader: {
                                async uploadByFile(file: File) {
                                    const [res] = await uploadFiles(
                                        [file],
                                        "imageUploader"
                                    );

                                    return {
                                        success: 1,
                                        file: {
                                            url: res.fileUrl,
                                        },
                                    };
                                },
                            },
                        },
                    },
                    video: {
                        class: CustomVideoTool,
                        config: {
                            uploader: {
                                async uploadByFile(file: File) {
                                    const [res] = await uploadFiles(
                                        [file],
                                        "imageUploader"
                                    );

                                    return {
                                        success: 1,
                                        file: {
                                            url: res.fileUrl,
                                        },
                                    };
                                },
                            },
                            types: "video/*",
                            placeholder: "Upload your image",
                        },
                        toolbox: {
                            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none"><path d="M16 10L18.5768 8.45392C19.3699 7.97803 19.7665 7.74009 20.0928 7.77051C20.3773 7.79703 20.6369 7.944 20.806 8.17433C21 8.43848 21 8.90095 21 9.8259V14.1741C21 15.099 21 15.5615 20.806 15.8257C20.6369 16.056 20.3773 16.203 20.0928 16.2295C19.7665 16.2599 19.3699 16.022 18.5768 15.5461L16 14M6.2 18H12.8C13.9201 18 14.4802 18 14.908 17.782C15.2843 17.5903 15.5903 17.2843 15.782 16.908C16 16.4802 16 15.9201 16 14.8V9.2C16 8.0799 16 7.51984 15.782 7.09202C15.5903 6.71569 15.2843 6.40973 14.908 6.21799C14.4802 6 13.9201 6 12.8 6H6.2C5.0799 6 4.51984 6 4.09202 6.21799C3.71569 6.40973 3.40973 6.71569 3.21799 7.09202C3 7.51984 3 8.07989 3 9.2V14.8C3 15.9201 3 16.4802 3.21799 16.908C3.40973 17.2843 3.71569 17.5903 4.09202 17.782C4.51984 18 5.07989 18 6.2 18Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
                            title: "Video",
                        },
                    },
                    list: List,
                    code: Code,
                    inlineCode: InlineCode,
                    table: Table,
                    embed: Embed,
                },
            });
        }
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setIsMounted(true);
        }
    }, []);

    useEffect(() => {
        if (Object.keys(errors).length) {
            for (const [_key, value] of Object.entries(errors)) {
                toast({
                    title: "Something went wrong",
                    description: (value as { message: string }).message,
                    variant: "destructive",
                });
            }
        }
    }, [errors]);

    useEffect(() => {
        const init = async () => {
            await initializeEditor();

            setTimeout(() => {
                // set focus to title
                _titleRef.current?.focus();
            }, 0);
        };
        if (isMounted) {
            init();

            return () => {
                ref.current?.destroy();
                ref.current = undefined;
            };
        }
    }, [isMounted, initializeEditor]);

    const { mutate: createPost } = useMutation({
        mutationFn: async ({
            title,
            content,
            subredditId,
        }: PostCreationRequest) => {
            const payload: PostCreationRequest = {
                subredditId,
                title,
                content,
            };

            const { data } = await axios.post(
                "/api/subreddit/post/create",
                payload
            );
            return data;
        },
        onError: () => {
            return toast({
                title: "Something went wrong",
                description:
                    "Your post was not published, please try again later.",
                variant: "destructive",
            });
        },
        onSuccess: () => {
            // turn pathname /r/mycommunity/submit into /r/mycommunity
            const newPathname = pathname.split("/").slice(0, -1).join("/");
            router.push(newPathname);

            router.refresh();

            return toast({
                description: "Your post has been published.",
            });
        },
    });

    async function onSubmit(data: PostCreationRequest) {
        const blocks = await ref.current?.save();

        const payload: PostCreationRequest = {
            title: data.title,
            content: blocks,
            subredditId,
        };

        createPost(payload);
    }

    if (!isMounted) {
        return null;
    }

    const { ref: titleRef, ...rest } = register("title");

    return (
        <div className="w-full p-4 bg-zinc-50 rounded-lg border border-zinc-200">
            <form
                id="subreddit-post-form"
                className="w-fit"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="prose prose-stone dark:prose-invert">
                    <TextareaAutosize
                        ref={(e) => {
                            titleRef(e);
                            // @ts-ignore
                            _titleRef.current = e;
                        }}
                        {...rest}
                        placeholder="Title"
                        className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
                    />
                    <div id="editor" className="min-h-[500px]" />
                    <p className="text-sm text-gray-500">
                        Use{" "}
                        <kbd className="rounded-md border bg-muted px-1 text-xs uppercase">
                            Tab
                        </kbd>{" "}
                        to open the command menu.
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Editor;
