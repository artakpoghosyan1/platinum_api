/** @type {import('next').NextConfig} */
const nextConfig = {
    api: {
        bodyParser: false
    },
    images: {
        domains: ['localhost'],
    },
};

export default nextConfig;
