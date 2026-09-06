import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This app is deployed as its own Vercel project and reached at
  // askmirra.ai/brand only via a rewrite from the main site's Vercel
  // project (see /vercel.json at the repo root) — this app has no direct
  // custom domain of its own. Two things that setup requires:

  // 1. Static assets (JS/CSS chunks) must live under a path the root
  //    project also rewrites, since they're normally served from /_next/*
  //    at the domain root, which askmirra.ai's rewrite doesn't cover.
  assetPrefix: "/brand-static",

  experimental: {
    serverActions: {
      // Server Actions compare the request's Origin against this
      // deployment's own host to block CSRF; since the browser sees
      // askmirra.ai (not this project's *.vercel.app host) when the page
      // is loaded through the rewrite, that origin must be allow-listed
      // explicitly or every login/delete action gets rejected.
      allowedOrigins: ["askmirra.ai", "www.askmirra.ai"],
    },
  },
};

export default nextConfig;
