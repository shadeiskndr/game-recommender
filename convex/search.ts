import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { Doc } from "./_generated/dataModel";

const EMBED_MODEL = "text-embedding-3-large";
const EMBED_DIMS = 3072;

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

export const searchByText = action({
  args: { query: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, { query, limit }): Promise<
    Array<Doc<"games"> & { _score: number }>
  > => {
    const trimmed = query.trim();
    if (!trimmed) return [];

    const vector = await embedQuery(trimmed);
    const requested = limit ?? 12;

    const raw = await ctx.vectorSearch("gameEmbeddings", "by_embedding", {
      vector,
      limit: requested,
    });

    return await ctx.runQuery(internal.games._hydrateByEmbeddingIds, {
      results: raw.map((r) => ({ embeddingId: r._id, score: r._score })),
    });
  },
});
