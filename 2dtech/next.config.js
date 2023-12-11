/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "uploadthing.com",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
                pathname: "**",
            },
        ],
    },
    // experimental: { // next 14 ko dùng cái này nhé
    //   appDir: true,
    // },
};

module.exports = nextConfig;
