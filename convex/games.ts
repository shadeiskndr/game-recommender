import { v } from "convex/values";
import {
  query,
  mutation,
  action,
  internalQuery,
} from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";

const FEATURED_GENRES = ["Action, Adventure", "Racing"];
const FEATURED_PLATFORMS = ["PlayStation 5", "PC, PlayStation 5"];

export const featured = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    const cap = limit ?? 12;
    const perCombo = Math.ceil(cap / (FEATURED_GENRES.length * FEATURED_PLATFORMS.length));
    const buckets = await Promise.all(
      FEATURED_GENRES.flatMap((g) =>
        FEATURED_PLATFORMS.map((p) =>
          ctx.db
            .query("games")
            .withIndex("by_genres_platforms", (q) =>
              q.eq("genres", g).eq("platforms", p),
            )
            .take(perCombo),
        ),
      ),
    );
    return buckets.flat().slice(0, cap);
  },
});

export const bySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("games")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
  },
});

export const _getEmbeddingForGame = internalQuery({
  args: { gameId: v.id("games") },
  handler: async (ctx, { gameId }) => {
    const game = await ctx.db.get(gameId);
    if (!game || !game.embeddingId) return null;
    const emb = await ctx.db.get(game.embeddingId);
    return emb ? { embedding: emb.embedding, gameId } : null;
  },
});

export const _hydrateByEmbeddingIds = internalQuery({
  args: {
    results: v.array(
      v.object({
        embeddingId: v.id("gameEmbeddings"),
        score: v.number(),
      }),
    ),
    excludeGameId: v.optional(v.id("games")),
  },
  handler: async (ctx, { results, excludeGameId }) => {
    const out: Array<Doc<"games"> & { _score: number }> = [];
    for (const r of results) {
      const game = await ctx.db
        .query("games")
        .withIndex("by_embeddingId", (q) => q.eq("embeddingId", r.embeddingId))
        .unique();
      if (!game) continue;
      if (excludeGameId && game._id === excludeGameId) continue;
      out.push({ ...game, _score: r.score });
    }
    return out;
  },
});

export const similarToSlug = action({
  args: { slug: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, { slug, limit }): Promise<
    Array<Doc<"games"> & { _score: number }>
  > => {
    const game: Doc<"games"> | null = await ctx.runQuery(
      internal.games.bySlugInternal,
      { slug },
    );
    if (!game || !game.embeddingId) return [];

    const seed: { embedding: number[]; gameId: Id<"games"> } | null =
      await ctx.runQuery(internal.games._getEmbeddingForGame, {
        gameId: game._id,
      });
    if (!seed) return [];

    const requested = limit ?? 7;
    // Request one extra so we can drop the seed game itself.
    const raw = await ctx.vectorSearch("gameEmbeddings", "by_embedding", {
      vector: seed.embedding,
      limit: requested + 1,
    });

    const hydrated: Array<Doc<"games"> & { _score: number }> =
      await ctx.runQuery(internal.games._hydrateByEmbeddingIds, {
        results: raw.map((r) => ({ embeddingId: r._id, score: r._score })),
        excludeGameId: game._id,
      });

    return hydrated.slice(0, requested);
  },
});

export const bySlugInternal = internalQuery({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("games")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
  },
});

// Public so the one-shot backfill script can call it via ConvexHttpClient.
// Restrict or remove after the initial import.
export const importGame = mutation({
  args: {
    externalId: v.number(),
    slug: v.string(),
    name: v.string(),
    released: v.string(),
    rating: v.string(),
    genres: v.string(),
    platforms: v.string(),
    tags: v.string(),
    metacritic: v.string(),
    developers: v.string(),
    publishers: v.string(),
    playtime: v.string(),
    description: v.union(v.string(), v.null()),
    background_image: v.string(),
    embedding: v.array(v.float64()),
  },
  handler: async (ctx, args) => {
    const { embedding, ...gameFields } = args;
    const existing = await ctx.db
      .query("games")
      .withIndex("by_externalId", (q) => q.eq("externalId", args.externalId))
      .unique();

    if (existing) {
      // Update path: replace embedding doc in place if present, else create one.
      let embeddingId = existing.embeddingId;
      if (embeddingId) {
        await ctx.db.patch(embeddingId, {
          embedding,
          genres: args.genres,
          platforms: args.platforms,
        });
      } else {
        embeddingId = await ctx.db.insert("gameEmbeddings", {
          embedding,
          genres: args.genres,
          platforms: args.platforms,
        });
      }
      await ctx.db.patch(existing._id, { ...gameFields, embeddingId });
      return existing._id;
    }

    const embeddingId = await ctx.db.insert("gameEmbeddings", {
      embedding,
      genres: args.genres,
      platforms: args.platforms,
    });
    return await ctx.db.insert("games", { ...gameFields, embeddingId });
  },
});

// Paginated count helper: reads one page per call to stay under the 16MB
// per-function read limit. The client chains calls until isDone is true.
// Public so scripts/count.ts can call via ConvexHttpClient.
export const countGamesPage = query({
  args: { cursor: v.union(v.string(), v.null()) },
  handler: async (ctx, { cursor }) => {
    const page = await ctx.db
      .query("games")
      .paginate({ cursor, numItems: 500 });
    return {
      pageCount: page.page.length,
      isDone: page.isDone,
      continueCursor: page.continueCursor,
    };
  },
});
