import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" });

export const ourFileRouter = {
    imageUploader: f({
        image: { maxFileSize: "4MB" },
        video: { maxFileSize: "256MB", maxFileCount: 2 },
    })
        .middleware(async (req) => {
            const user = await auth(req);

            if (!user) throw new Error("Unauthorized");

            return { userId: user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
