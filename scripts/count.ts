/**
 * Count rows in the `games` table by paginating from the client side,
 * since a single Convex query can't read >16MB of docs.
 *
 * Usage: bun run count
 */
import { config as loadEnv } from "dotenv";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!CONVEX_URL) throw new Error("NEXT_PUBLIC_CONVEX_URL is not set");

type CountPage = {
  pageCount: number;
  isDone: boolean;
  continueCursor: string;
};

async function main() {
  const client = new ConvexHttpClient(CONVEX_URL!);

  let total = 0;
  let cursor: string | null = null;

  while (true) {
    const res: CountPage = await client.query(api.games.countGamesPage, {
      cursor,
    });
    total += res.pageCount;
    process.stdout.write(`\r  counted ${total}...`);
    if (res.isDone) break;
    cursor = res.continueCursor;
  }

  console.log(`\nTotal games: ${total}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
