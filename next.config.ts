import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
    ],
  },
  // sharp loads its libvips native lib via dlopen at runtime, so Next's file
  // tracer doesn't follow it and drops it from the deployed bundle (causing
  // "libvips-cpp.so… cannot open shared object file" on Linux hosts). Treat
  // sharp as external and force the native binaries into the server trace.
  serverExternalPackages: ["sharp"],
  outputFileTracingIncludes: {
    "/**": ["./node_modules/@img/**/*", "./node_modules/sharp/**/*"],
  },
};

export default withPayload(nextConfig);
