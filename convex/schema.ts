import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  games: defineTable({
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
    embeddingId: v.optional(v.id("gameEmbeddings")),
  })
    .index("by_slug", ["slug"])
    .index("by_externalId", ["externalId"])
    .index("by_embeddingId", ["embeddingId"])
    .index("by_genres_platforms", ["genres", "platforms"]),

  gameEmbeddings: defineTable({
    embedding: v.array(v.float64()),
    genres: v.string(),
    platforms: v.string(),
  }).vectorIndex("by_embedding", {
    vectorField: "embedding",
    dimensions: 3072,
    filterFields: ["genres", "platforms"],
  }),
});
