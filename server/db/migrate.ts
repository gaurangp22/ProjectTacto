import "dotenv/config";
import { db } from "./client";

const c = await db();
const r = await c.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
console.log(
  `Schema applied to ${process.env.TURSO_DATABASE_URL ? "Turso" : "local .data/tacto.db"}:`,
  r.rows.map((x) => x.name).join(", "),
);
