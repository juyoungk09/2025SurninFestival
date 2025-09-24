import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['lh3.googleusercontent.com'], //허용할 외부 이미지 호스트 추가
  },
};

export default nextConfig;
