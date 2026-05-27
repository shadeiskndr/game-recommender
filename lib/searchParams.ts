import { SORT_KEYS, type SortKey } from "./facets";

export const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 120;

export type SearchFilters = {
  genres: string[];
  platforms: string[];
  minRating?: number;
  yearFrom?: number;
  yearTo?: number;
  sort: SortKey;
  limit: number;
};

type RawParams = Record<string, string | string[] | undefined>;

function toArray(value: string | string[] | undefined): string[] {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

function toNumber(value: string | string[] | undefined): number | undefined {
  const s = Array.isArray(value) ? value[0] : value;
  if (s == null || s === "") return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

export function parseSearchParams(params: RawParams): SearchFilters {
  const sortRaw = Array.isArray(params.sort) ? params.sort[0] : params.sort;
  const sort: SortKey = SORT_KEYS.includes(sortRaw ?? "")
    ? (sortRaw as SortKey)
    : "relevance";

  const limit = toNumber(params.limit);

  return {
    genres: toArray(params.genres),
    platforms: toArray(params.platforms),
    minRating: toNumber(params.minRating),
    yearFrom: toNumber(params.yearFrom),
    yearTo: toNumber(params.yearTo),
    sort,
    limit: limit && limit > 0 ? Math.min(limit, MAX_LIMIT) : DEFAULT_LIMIT,
  };
}

// Builds a /search/<term> href from filters, omitting defaults to keep URLs clean.
export function buildSearchHref(
  term: string,
  filters: SearchFilters,
  overrides: Partial<SearchFilters> = {},
): string {
  const f = { ...filters, ...overrides };
  const p = new URLSearchParams();
  f.genres.forEach((g) => p.append("genres", g));
  f.platforms.forEach((pl) => p.append("platforms", pl));
  if (f.minRating != null) p.set("minRating", String(f.minRating));
  if (f.yearFrom != null) p.set("yearFrom", String(f.yearFrom));
  if (f.yearTo != null) p.set("yearTo", String(f.yearTo));
  if (f.sort !== "relevance") p.set("sort", f.sort);
  if (f.limit !== DEFAULT_LIMIT) p.set("limit", String(f.limit));
  const qs = p.toString();
  return `/search/${encodeURIComponent(term)}${qs ? `?${qs}` : ""}`;
}

export function countActiveFilters(filters: SearchFilters): number {
  return (
    filters.genres.length +
    filters.platforms.length +
    (filters.minRating != null ? 1 : 0) +
    (filters.yearFrom != null ? 1 : 0) +
    (filters.yearTo != null ? 1 : 0)
  );
}
