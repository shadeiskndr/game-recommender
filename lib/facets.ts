// Curated facet values for the search filter UI. These strings MUST match the
// tokens stored in the `genres` / `platforms` fields after splitting on ", "
// (e.g. "Action, Adventure" -> ["Action", "Adventure"]). They mirror RAWG's
// canonical genre and platform names. Deriving distinct values from Convex would
// require scanning the full ~20k-row catalog, so they're hardcoded here.

export const GENRES = [
  "Action",
  "Indie",
  "Adventure",
  "RPG",
  "Strategy",
  "Shooter",
  "Casual",
  "Simulation",
  "Puzzle",
  "Arcade",
  "Platformer",
  "Racing",
  "Massively Multiplayer",
  "Sports",
  "Fighting",
  "Family",
  "Board Games",
  "Card",
  "Educational",
] as const;

export const PLATFORMS = [
  "PC",
  "PlayStation 5",
  "PlayStation 4",
  "Xbox Series S/X",
  "Xbox One",
  "Nintendo Switch",
  "macOS",
  "Linux",
  "iOS",
  "Android",
] as const;

export const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "rating", label: "User Rating" },
  { value: "metacritic", label: "Metacritic" },
  { value: "released", label: "Release Date" },
  { value: "name", label: "Name (A–Z)" },
] as const;

export type SortKey = (typeof SORT_OPTIONS)[number]["value"];

export const SORT_KEYS: readonly string[] = SORT_OPTIONS.map((o) => o.value);

export const RATING_OPTIONS = [
  { value: "", label: "Any rating" },
  { value: "3", label: "3+ stars" },
  { value: "3.5", label: "3.5+ stars" },
  { value: "4", label: "4+ stars" },
  { value: "4.5", label: "4.5+ stars" },
] as const;

const CURRENT_YEAR = new Date().getFullYear();
const EARLIEST_YEAR = 1980;

export const YEARS: number[] = Array.from(
  { length: CURRENT_YEAR - EARLIEST_YEAR + 1 },
  (_, i) => CURRENT_YEAR - i,
);
