// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";
import playformCompress from "@playform/compress";
// https://astro.build/config
export default defineConfig({
  site: "https://wangking.net",
  integrations: [
    mdx(),
    sitemap(),
    playformCompress(),
  ],
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),


});
