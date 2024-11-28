import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createHtmlPlugin } from "vite-plugin-html";
import { viteStaticCopy } from "vite-plugin-static-copy"; // Adjusted to use named import

export default defineConfig({
  plugins: [
    react(),
    createHtmlPlugin({
      minify: true,
      pages: [
        {
          entry: "../src/main.tsx", // Entry file for the main app
          filename: "index.html",
          template: "public/index.html",
        }
      ],
    }),
    viteStaticCopy({ // Updated to use named import
      targets: [
        // {
        //   src: "public/index.html", // Copy template
        //   dest: "",                  // Destination root in the build
        //   rename: "popup.html",      // Rename as popup.html
        // },
        // {
        //   src: "src/ContentScript/content.tsx", // Ensure blank script is copied
        //   dest: "js",          // Destination folder in the build
        //   rename: "content.js",  // Rename or keep the same
        // },
      ],
    }),
  ],
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (/\.css$/.test(assetInfo.name)) {
            return "css/[name].[hash][extname]";
          }
          if (/\.woff2?$/.test(assetInfo.name)) {
            return "fonts/[name].[hash][extname]";
          }
          if (/\.(png|jpe?g|gif|svg)$/.test(assetInfo.name)) {
            return "images/[name].[hash][extname]";
          }
          return "[name].[hash][extname]";
        },
        chunkFileNames: "js/[name].[hash].js",
        entryFileNames: "js/[name].[hash].js",
      },
    },
  },
  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, "src/assets"), // Alias for easy import
    },
  },
});
