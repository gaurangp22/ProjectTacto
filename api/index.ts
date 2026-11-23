/**
 * Vercel serverless entry for the Express API.
 * vercel.json rewrites /api/<path> here as /api?__p=<path>; restore the original URL so Express routes match.
 */
import type { IncomingMessage, ServerResponse } from "node:http";
import { createServer } from "../server/index.js";

const app = createServer();

export default function handler(req: IncomingMessage, res: ServerResponse) {
  const u = new URL(req.url ?? "/", "http://x");
  const p = u.searchParams.get("__p");
  if (p !== null) {
    u.searchParams.delete("__p");
    const qs = u.searchParams.toString();
    req.url = `/api/${p}${qs ? `?${qs}` : ""}`;
  }
  return app(req as any, res as any);
}
