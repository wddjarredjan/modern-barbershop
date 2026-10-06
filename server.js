// server.ts
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
dotenv.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
function listenOnAvailablePort(app, preferredPort) {
  const portsToTry = Array.from(/* @__PURE__ */ new Set([preferredPort, 3001, 3002, 3003, 4e3, 4001, 5e3, 8080, 9e3]));
  let portIndex = 0;
  const attemptListen = () => {
    const port = portsToTry[portIndex];
    const server = app.listen(port, "0.0.0.0", () => {
      console.log(`[Server] Modern Barbershop by Karl running on http://0.0.0.0:${port}`);
    });
    server.on("error", (error) => {
      if (error.code === "EADDRINUSE" && portIndex < portsToTry.length - 1) {
        portIndex += 1;
        console.warn(`[Server] Port ${port} is in use. Retrying on ${portsToTry[portIndex]}...`);
        attemptListen();
        return;
      }
      console.error("[Server] Failed to start server:", error);
      process.exit(1);
    });
  };
  attemptListen();
}
async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3e3);
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", shop: "Modern Barbershop by Karl" });
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
  listenOnAvailablePort(app, PORT);
}
startServer();
