import { createClient, type Client } from "@libsql/client";
import fs from "node:fs";
import path from "node:path";
import { SCHEMA } from "./schema";

/**
 * Turso (libSQL) connection.
 *
 * Production: set TURSO_DATABASE_URL (libsql://<db>-<org>.turso.io) and TURSO_AUTH_TOKEN.
 * Local dev:  falls back to a SQLite file at .data/tacto.db, same SQL dialect, zero setup.
 */
let client: Client | null = null;
let ready: Promise<void> | null = null;

function makeClient(): Client {
  const url = process.env.TURSO_DATABASE_URL;
  if (url) {
    return createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
  }
  if (process.env.NODE_ENV === "production" && !process.env.TACTO_ALLOW_FILE_DB) {
    throw new Error("TURSO_DATABASE_URL is not set");
  }
  const dir = path.resolve(process.cwd(), ".data");
  fs.mkdirSync(dir, { recursive: true });
  return createClient({ url: `file:${path.join(dir, "tacto.db").replace(/\\/g, "/")}` });
}

export async function db(): Promise<Client> {
  if (!client) client = makeClient();
  if (!ready) {
    const c = client;
    ready = c
      .batch(SCHEMA, "write")
      // additive migrations for databases created by older versions
      .then(() => c.execute("ALTER TABLE contact_messages ADD COLUMN role TEXT").catch(() => undefined))
      .then(() => undefined);
    ready.catch(() => {
      ready = null; // retry on next request
    });
  }
  await ready;
  return client;
}
