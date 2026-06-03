import compression from "compression";
import express from "express";
import fs from "fs";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { handleFormSubmissionRequest } from "./form-submissions";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const canonicalRedirects: Record<string, string> = {
  "/terms": "/policies",
};

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.disable("x-powered-by");
  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    if (process.env.NODE_ENV === "production") {
      res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    }
    next();
  });
  app.use(compression({ threshold: 1024 }));
  app.use(express.json({ limit: "5.5mb" }));

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.get("/healthz", (_req, res) => {
    res.status(200).json({ ok: true });
  });

  app.get(Object.keys(canonicalRedirects), (req, res) => {
    const destination = canonicalRedirects[req.path];
    const queryIndex = req.originalUrl.indexOf("?");
    const query = queryIndex >= 0 ? req.originalUrl.slice(queryIndex) : "";

    res.redirect(301, `${destination}${query}`);
  });

  app.all("/api/forms", (req, res) => {
    void handleFormSubmissionRequest(req, res);
  });

  app.all("/api/contact", (req, res) => {
    void handleFormSubmissionRequest(req, res);
  });

  app.use(
    express.static(staticPath, {
      index: false,
      redirect: false,
      setHeaders(res, filePath) {
        if (filePath.includes(`${path.sep}assets${path.sep}`)) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
          return;
        }

        res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
      },
    }),
  );

  app.get("*", (req, res) => {
    res.setHeader("Cache-Control", "no-cache");

    if (req.path === "/404") {
      res.status(404).sendFile(path.join(staticPath, "404.html"));
      return;
    }

    const routePath =
      req.path === "/"
        ? path.join(staticPath, "index.html")
        : path.join(staticPath, `${req.path.replace(/^\/+/, "")}.html`);

    if (fs.existsSync(routePath)) {
      res.sendFile(routePath);
      return;
    }

    res.status(404).sendFile(path.join(staticPath, "404.html"));
  });

  const port = Number(process.env.PORT) || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
