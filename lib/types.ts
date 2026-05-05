import type { Doc } from "@/convex/_generated/dataModel";

export type Game = Doc<"games">;

export type SimilarGame = Game & { _score: number };
