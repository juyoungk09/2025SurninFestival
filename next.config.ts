import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['lh3.googleusercontent.com'], //허용할 외부 이미지 호스트 추가
  },
  eslint: {
    ignoreDuringBuilds: true, // 빌드 시 ESLint 체크 무시
  },
};

export default nextConfig;
