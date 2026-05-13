import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type Plugin } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

function localVercelApi(): Plugin {
  return {
    name: "local-vercel-api",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/api/contact", async (req, res) => {
        if (!req.url) return;

        const chunks: Buffer[] = [];
        for await (const chunk of req) {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        }

        const rawBody = Buffer.concat(chunks).toString("utf8");
        const headers = Object.fromEntries(
          Object.entries(req.headers).map(([key, value]) => [key, Array.isArray(value) ? value.join(",") : value]),
        );
        const request = Object.assign(req, {
          body: rawBody ? JSON.parse(rawBody) : undefined,
          headers,
        });
        const response = Object.assign(res, {
          status(statusCode: number) {
            res.statusCode = statusCode;
            return response;
          },
          json(body: unknown) {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(body));
          },
        });

        const { default: handler } = await import("./api/contact.js");
        await handler(request, response);
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  Object.assign(process.env, env);

  return {
    plugins: [
      localVercelApi(),
      tsConfigPaths(),
      tanstackStart({
        prerender: {
          enabled: true,
          crawlLinks: true,
        },
      }),
      tailwindcss(),
      react(),
    ],
  };
});
