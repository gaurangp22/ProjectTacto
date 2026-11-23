import "dotenv/config";
import express, { type RequestHandler } from "express";
import cors from "cors";
import { db } from "./db/client.js";
import { ApplicationInput, ContactInput, ProgressInput, WaitlistInput, type ProgressRow } from "../shared/api.js";
import { MAX_CV_BYTES, jobBySlug } from "../shared/careers.js";

/** Tiny fixed-window rate limiter (per IP, per route). Good enough for form spam. */
function rateLimit(max: number, windowMs: number): RequestHandler {
  const hits = new Map<string, { n: number; t: number }>();
  return (req, res, next) => {
    const key = req.ip ?? "anon";
    const now = Date.now();
    const h = hits.get(key);
    if (!h || now - h.t > windowMs) hits.set(key, { n: 1, t: now });
    else if (++h.n > max) return void res.status(429).json({ ok: false, error: "Too many requests, try again in a minute." });
    if (hits.size > 5000) hits.clear();
    next();
  };
}

const wrap =
  (fn: RequestHandler): RequestHandler =>
  async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (e) {
      console.error("[api]", e);
      res.status(500).json({ ok: false, error: "Something went wrong on our side." });
    }
  };

export function createServer() {
  const app = express();
  app.set("trust proxy", true);
  app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") ?? true }));
  // Job applications carry an optional CV (base64), so this route gets a larger body limit than the rest.
  app.post("/api/careers/apply", express.json({ limit: "3mb" }), rateLimit(4, 10 * 60_000), wrap(async (req, res) => {
    const p = ApplicationInput.safeParse(req.body);
    if (!p.success) {
      const field = String(p.error.issues[0]?.path[0] ?? "");
      const msg: Record<string, string> = {
        name: "Please tell us your name.",
        email: "Please enter a valid email.",
        coverLetter: "Please write at least a couple of sentences about why you're applying.",
        linkedin: "Your LinkedIn link doesn't look like a valid URL.",
        portfolio: "Your portfolio link doesn't look like a valid URL.",
        consent: "Please agree to us storing your application.",
        cv: "Your CV must be a PDF or Word document under 2 MB.",
      };
      return void res.status(400).json({ ok: false, error: msg[field] ?? "Please check the form and try again." });
    }
    const d = p.data;
    if (d.website) return void res.json({ ok: true }); // bot
    if (d.jobSlug !== "general" && !jobBySlug(d.jobSlug)) {
      return void res.status(400).json({ ok: false, error: "This role is no longer open." });
    }
    let cv: Uint8Array | null = null;
    if (d.cv) {
      cv = Buffer.from(d.cv.data, "base64");
      if (cv.byteLength === 0 || cv.byteLength > MAX_CV_BYTES) {
        return void res.status(400).json({ ok: false, error: "Your CV must be a PDF or Word document under 2 MB." });
      }
    }
    const c = await db();
    await c.execute({
      sql: `INSERT INTO job_applications (job_slug, name, email, phone, location, linkedin, portfolio, cover_letter, cv_name, cv_type, cv_data)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        d.jobSlug, d.name, d.email.toLowerCase(), d.phone || null, d.location || null, d.linkedin || null,
        d.portfolio || null, d.coverLetter, d.cv?.name ?? null, d.cv?.type ?? null, cv,
      ],
    });
    res.json({ ok: true });
  }));

  app.use(express.json({ limit: "32kb" }));

  app.get("/api/health", wrap(async (_req, res) => {
    const c = await db();
    await c.execute("SELECT 1");
    res.json({ ok: true, db: process.env.TURSO_DATABASE_URL ? "turso" : "local" });
  }));

  app.post("/api/waitlist", rateLimit(8, 60_000), wrap(async (req, res) => {
    const p = WaitlistInput.safeParse(req.body);
    if (!p.success) return void res.status(400).json({ ok: false, error: "Please enter a valid email." });
    if (p.data.website) return void res.json({ ok: true }); // bot
    const c = await db();
    const r = await c.execute({
      sql: `INSERT INTO waitlist (email, name, role, organization) VALUES (?, ?, ?, ?)
            ON CONFLICT(email) DO NOTHING`,
      args: [p.data.email.toLowerCase(), p.data.name || null, p.data.role, p.data.organization || null],
    });
    res.json({ ok: true, data: { alreadyJoined: r.rowsAffected === 0 } });
  }));

  app.post("/api/contact", rateLimit(5, 60_000), wrap(async (req, res) => {
    const p = ContactInput.safeParse(req.body);
    if (!p.success) return void res.status(400).json({ ok: false, error: "Please fill in your name, a valid email and a message." });
    if (p.data.website) return void res.json({ ok: true });
    const c = await db();
    await c.execute({
      sql: `INSERT INTO contact_messages (name, email, organization, role, topic, message) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [p.data.name, p.data.email, p.data.organization || null, p.data.role || null, p.data.topic, p.data.message],
    });
    res.json({ ok: true });
  }));

  /** Anonymous learner progress for the simulator. No PII: the id is a random UUID minted in the browser. */
  app.post("/api/progress", rateLimit(60, 60_000), wrap(async (req, res) => {
    const p = ProgressInput.safeParse(req.body);
    if (!p.success) return void res.status(400).json({ ok: false, error: "Bad progress payload" });
    const { learnerId, lessonId, stars, blocks } = p.data;
    const c = await db();
    await c.batch(
      [
        {
          sql: `INSERT INTO learners (id) VALUES (?) ON CONFLICT(id) DO UPDATE SET last_seen = datetime('now')`,
          args: [learnerId],
        },
        {
          sql: `INSERT INTO lesson_progress (learner_id, lesson_id, stars, best_blocks) VALUES (?, ?, ?, ?)
                ON CONFLICT(learner_id, lesson_id) DO UPDATE SET
                  stars = MAX(stars, excluded.stars),
                  best_blocks = CASE
                    WHEN best_blocks IS NULL THEN excluded.best_blocks
                    WHEN excluded.best_blocks IS NULL THEN best_blocks
                    ELSE MIN(best_blocks, excluded.best_blocks) END,
                  completed_at = datetime('now')`,
          args: [learnerId, lessonId, stars, blocks ?? null],
        },
      ],
      "write",
    );
    res.json({ ok: true });
  }));

  app.get("/api/progress/:learnerId", wrap(async (req, res) => {
    const id = String(req.params.learnerId);
    if (!/^[a-z0-9-]{16,64}$/i.test(id)) return void res.status(400).json({ ok: false, error: "Bad id" });
    const c = await db();
    const r = await c.execute({
      sql: `SELECT lesson_id, stars, best_blocks FROM lesson_progress WHERE learner_id = ?`,
      args: [id],
    });
    const data: ProgressRow[] = r.rows.map((row) => ({
      lessonId: String(row.lesson_id),
      stars: Number(row.stars),
      bestBlocks: row.best_blocks == null ? null : Number(row.best_blocks),
    }));
    res.json({ ok: true, data });
  }));

  /** Public, aggregate-only stats (no personal data). */
  app.get("/api/stats", wrap(async (_req, res) => {
    const c = await db();
    const r = await c.execute(
      `SELECT (SELECT COUNT(*) FROM learners) AS learners, (SELECT COUNT(*) FROM lesson_progress) AS lessons`,
    );
    res.json({ ok: true, data: { learners: Number(r.rows[0].learners), lessonsCompleted: Number(r.rows[0].lessons) } });
  }));

  app.use("/api", (_req, res) => void res.status(404).json({ ok: false, error: "Not found" }));
  return app;
}
