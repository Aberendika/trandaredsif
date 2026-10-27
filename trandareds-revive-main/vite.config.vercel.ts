// Vite config used ONLY when deploying to Vercel.
// Lovable's default vite.config.ts targets Cloudflare Workers — that
// plugin is incompatible with Vercel, so we ship a separate config that
// uses Nitro (Vercel's recommended adapter for TanStack Start).
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

export default defineConfig({
  plugins: [
    tsConfigPaths(),
    tailwindcss(),
    tanstackStart(),
    nitro(),
    viteReact(),
  ],
  resolve: {
    dedupe: ["react", "react-dom", "@tanstack/react-router"],
  },
});
