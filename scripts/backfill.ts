/**
 * One-shot backfill: SQLite -> Convex.
 *
 * Reads the existing 3072-dim OpenAI embeddings stored as JSON in the
 * `embedding` column of videogames_with_embeddings.db, no re-embedding needed.
 *
 * Usage:
 *   bun run backfill
 *
 * Required env (loaded from .env.local then .env):
 *   NEXT_PUBLIC_CONVEX_URL  - your Convex deployment URL
 *   SQLITE_PATH             - default ./videogames_with_embeddings.db
 *   CONCURRENCY             - default 8 (parallel mutations)
 *   START_OFFSET            - default 0 (resume support)
 */
import { config as loadEnv } from "dotenv";
import Database from "better-sqlite3";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!CONVEX_URL) {
  throw new Error(
    "NEXT_PUBLIC_CONVEX_URL is not set. Run `npx convex dev` first to generate .env.local.",
  );
}

const SQLITE_PATH =
  process.env.SQLITE_PATH ?? "./videogames_with_embeddings.db";
const CONCURRENCY = Number(process.env.CONCURRENCY ?? 8);
const START_OFFSET = Number(process.env.START_OFFSET ?? 0);
const EXPECTED_DIMS = 3072;

type Row = {
  id: number;
  name: string | null;
  released: string | null;
  rating: number | null;
  genres: string | null;
  platforms: string | null;
  tags: string | null;
  metacritic: number | null;
  developers: string | null;
  publishers: string | null;
  playtime: number | null;
  description: string | null;
  background_image: string | null;
  slug: string | null;
  embedding: string | null;
};

function s(v: unknown): string {
  if (v === null || v === undefined) return "";
  return String(v);
}

async function main() {
  const db = new Database(SQLITE_PATH, { readonly: true });
  const total = (
    db.prepare("SELECT COUNT(*) AS c FROM games").get() as { c: number }
  ).c;
  const rows = db
    .prepare(
      `SELECT id, name, released, rating, genres, platforms, tags, metacritic,
              developers, publishers, playtime, description, background_image, slug,
              embedding
       FROM games
       WHERE slug IS NOT NULL AND slug != ''
         AND embedding IS NOT NULL AND embedding != ''
       ORDER BY id`,
    )
    .all() as Row[];

  const slice = rows.slice(START_OFFSET);
  console.log(
    `Loaded ${rows.length}/${total} rows with embeddings (skipping first ${START_OFFSET}).\n` +
      `  Convex:       ${CONVEX_URL}\n` +
      `  Concurrency:  ${CONCURRENCY} parallel mutations\n` +
      `  Expected dim: ${EXPECTED_DIMS}`,
  );

  const client = new ConvexHttpClient(CONVEX_URL!);

  const t0 = Date.now();
  let done = 0;
  let nextIndex = 0;

  async function worker() {
    while (true) {
      const i = nextIndex++;
      if (i >= slice.length) return;
      const row = slice[i];

      let embedding: number[];
      try {
        embedding = JSON.parse(row.embedding!) as number[];
      } catch (e) {
        console.warn(`Skipping id=${row.id}: invalid embedding JSON`);
        continue;
      }
      if (!Array.isArray(embedding) || embedding.length !== EXPECTED_DIMS) {
        console.warn(
          `Skipping id=${row.id}: embedding length ${embedding.length} != ${EXPECTED_DIMS}`,
        );
        continue;
      }

      try {
        await client.mutation(api.games.importGame, {
          externalId: row.id,
          slug: row.slug ?? `game-${row.id}`,
          name: row.name ?? "",
          released: s(row.released),
          rating: s(row.rating),
          genres: s(row.genres),
          platforms: s(row.platforms),
          tags: s(row.tags),
          metacritic: s(row.metacritic),
          developers: s(row.developers),
          publishers: s(row.publishers),
          playtime: s(row.playtime),
          description: row.description ?? null,
          background_image: s(row.background_image),
          embedding,
        });
      } catch (e) {
        console.error(
          `Mutation failed at offset ${START_OFFSET + i} (id=${row.id}). ` +
            `Re-run with START_OFFSET=${START_OFFSET + i} to resume.`,
        );
        throw e;
      }

      const n = ++done;
      if (n % 100 === 0 || n === slice.length) {
        const elapsed = (Date.now() - t0) / 1000;
        const rate = n / elapsed;
        const remaining = (slice.length - n) / Math.max(rate, 0.001);
        console.log(
          `  [${new Date().toISOString().slice(11, 19)}] done=${n}/${slice.length}  ` +
            `${rate.toFixed(1)} rows/s  ETA ${(remaining / 60).toFixed(1)}m`,
        );
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

  console.log(
    `\nDone. Imported ${done} rows in ${((Date.now() - t0) / 1000).toFixed(1)}s.`,
  );
  db.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
