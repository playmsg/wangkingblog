// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://wangking.net",
  integrations: [mdx(), sitemap()],
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  vite: {
    build: {
      // 启用或禁用 minify。'terser' 是默认值，效果最好。
      // 在生产环境中，Astro 默认就是开启的，但我们明确写出来以进行配置。
      minify: 'terser',
      terserOptions: {
        // Terser 的配置选项
        format: {
          // 告诉 Terser 移除所有注释
          comments: false,
        },
        compress: {
          // (可选，但强烈推荐) 移除所有 console.log 语句
          drop_console: true,
        },
      },
    },
  },
});
