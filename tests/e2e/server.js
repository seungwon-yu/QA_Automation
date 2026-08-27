import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const port = Number(process.env.PORT ?? 4173);
const host = "127.0.0.1";
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const idleShutdownMs = Number(process.env.E2E_SERVER_IDLE_SHUTDOWN_MS ?? 5000);
let idleTimer = null;

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8"
};

const server = createServer(async (request, response) => {
  scheduleIdleShutdown();

  const filePath = resolveRequestPath(request.url);

  if (!filePath) {
    response.writeHead(400);
    response.end("Bad Request");
    return;
  }

  try {
    const info = await stat(filePath);

    if (!info.isFile()) {
      response.writeHead(404);
      response.end("Not Found");
      return;
    }

    response.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Type": mimeTypes[path.extname(filePath)] ?? "application/octet-stream"
    });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404);
    response.end("Not Found");
  }
});

server.listen(port, host, () => {
  console.log(`QA E2E server listening on http://${host}:${port}`);
  scheduleIdleShutdown();
});

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.on("SIGBREAK", shutdown);

function resolveRequestPath(url) {
  try {
    const pathname = decodeURIComponent(new URL(url, `http://${host}:${port}`).pathname);
    const relativePath = pathname === "/" ? "index.html" : pathname.slice(1);
    const filePath = path.resolve(projectRoot, relativePath);
    const pathFromRoot = path.relative(projectRoot, filePath);

    if (pathFromRoot.startsWith("..") || path.isAbsolute(pathFromRoot)) {
      return null;
    }

    return filePath;
  } catch {
    return null;
  }
}

function shutdown() {
  if (idleTimer) {
    clearTimeout(idleTimer);
  }

  server.close(() => {
    process.exit(0);
  });
}

function scheduleIdleShutdown() {
  if (idleTimer) {
    clearTimeout(idleTimer);
  }

  idleTimer = setTimeout(() => {
    shutdown();
  }, idleShutdownMs);
}
