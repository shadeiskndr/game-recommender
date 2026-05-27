import { v } from "convex/values";
import {
  action,
  internalQuery,
  internalMutation,
} from "./_generated/server";
import { internal } from "./_generated/api";
import { Doc } from "./_generated/dataModel";
import type { ActionCtx } from "./_generated/server";

const EMBED_MODEL = "text-embedding-3-large";
const EMBED_DIMS = 3072;

// Convex vector search caps `limit` at 256 with no cursor/offset, so this is the
// hard ceiling on the candidate pool we filter and sort over.
const CANDIDATE_POOL = 256;
const DEFAULT_LIMIT = 12;

type ScoredGame = Doc<"games"> & { _score: number };
type SortKey = "relevance" | "rating" | "metacritic" | "released" | "name";

async function embedQuery(text: string): Promise<number[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not set on the Convex deployment. Run `npx convex env set OPENAI_API_KEY sk-...`.",
    );
  }

  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: EMBED_MODEL,
      input: text,
    }),
  });

  if (!res.ok) {
    throw new Error(
      `OpenAI embeddings failed: ${res.status} ${await res.text()}`,
    );
  }

  const data = (await res.json()) as {
    data?: Array<{ embedding: number[] }>;
  };
  const vec = data.data?.[0]?.embedding;
  if (!vec || vec.length !== EMBED_DIMS) {
    throw new Error(
      `OpenAI returned unexpected embedding (length ${vec?.length ?? 0}, expected ${EMBED_DIMS})`,
    );
  }
  return vec;
}

// Embeds `text`, caching the vector by normalized query so repeated requests for
// the same term (every facet toggle / sort change / load-more) reuse it.
async function getEmbedding(ctx: ActionCtx, text: string): Promise<number[]> {
  const normalized = text.trim().toLowerCase();
  const cached: number[] | null = await ctx.runQuery(
    internal.search._getCachedEmbedding,
    { query: normalized },
  );
  if (cached) return cached;

  const vector = await embedQuery(normalized);
  await ctx.runMutation(internal.search._cacheEmbedding, {
    query: normalized,
    vector,
  });
  return vector;
}

function num(s: string): number {
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : Number.NEGATIVE_INFINITY;
}

function year(released: string): number {
  const y = parseInt(released.slice(0, 4), 10);
  return Number.isFinite(y) ? y : Number.NEGATIVE_INFINITY;
}

function sortGames(games: ScoredGame[], sort: SortKey): ScoredGame[] {
  if (sort === "relevance") return games; // already ordered by vector score
  const sorted = [...games];
  switch (sort) {
    case "rating":
      sorted.sort((a, b) => num(b.rating) - num(a.rating));
      break;
    case "metacritic":
      sorted.sort((a, b) => num(b.metacritic) - num(a.metacritic));
      break;
    case "released":
      sorted.sort((a, b) => year(b.released) - year(a.released));
      break;
    case "name":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }
  return sorted;
}

export const _getCachedEmbedding = internalQuery({
  args: { query: v.string() },
  handler: async (ctx, { query }) => {
    const row = await ctx.db
      .query("queryEmbeddings")
      .withIndex("by_query", (q) => q.eq("query", query))
      .unique();
    return row ? row.vector : null;
  },
});

export const _cacheEmbedding = internalMutation({
  args: { query: v.string(), vector: v.array(v.float64()) },
  handler: async (ctx, { query, vector }) => {
    const existing = await ctx.db
      .query("queryEmbeddings")
      .withIndex("by_query", (q) => q.eq("query", query))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { vector });
    } else {
      await ctx.db.insert("queryEmbeddings", { query, vector });
    }
  },
});

export const searchByText = action({
  args: {
    query: v.string(),
    genres: v.optional(v.array(v.string())),
    platforms: v.optional(v.array(v.string())),
    minRating: v.optional(v.number()),
    yearFrom: v.optional(v.number()),
    yearTo: v.optional(v.number()),
    sort: v.optional(
      v.union(
        v.literal("relevance"),
        v.literal("rating"),
        v.literal("metacritic"),
        v.literal("released"),
        v.literal("name"),
      ),
    ),
    limit: v.optional(v.number()),
  },
  handler: async (
    ctx,
    { query, genres, platforms, minRating, yearFrom, yearTo, sort, limit },
  ): Promise<{
    results: ScoredGame[];
    hasMore: boolean;
    poolExhausted: boolean;
  }> => {
    const trimmed = query.trim();
    if (!trimmed) return { results: [], hasMore: false, poolExhausted: false };

    const vector = await getEmbedding(ctx, trimmed);

    const raw = await ctx.vectorSearch("gameEmbeddings", "by_embedding", {
      vector,
      limit: CANDIDATE_POOL,
    });

    const filtered: ScoredGame[] = await ctx.runQuery(
      internal.games._hydrateByEmbeddingIds,
      {
        results: raw.map((r) => ({ embeddingId: r._id, score: r._score })),
        genres,
        platforms,
        minRating,
        yearFrom,
        yearTo,
      },
    );

    const sorted = sortGames(filtered, sort ?? "relevance");
    const window = limit ?? DEFAULT_LIMIT;

    return {
      results: sorted.slice(0, window),
      hasMore: sorted.length > window,
      // The candidate pool hit the vector-search ceiling, so more matches may
      // exist in the catalog than we could retrieve.
      poolExhausted: raw.length >= CANDIDATE_POOL,
    };
  },
});
