import GamePoster from "@/components/GamePoster";
import SearchFilters from "@/components/SearchFilters";
import { fetchAction } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import {
  parseSearchParams,
  buildSearchHref,
  DEFAULT_LIMIT,
} from "@/lib/searchParams";

export const dynamic = "force-dynamic";

type SearchTermProps = {
  params: Promise<{
    term: string;
  }>;
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

async function SearchTerm({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: SearchTermProps) {
  const { term } = await paramsPromise;
  const rawParams = (await searchParamsPromise) ?? {};
  const decodedTerm = decodeURIComponent(term);
  const filters = parseSearchParams(rawParams);

  const { results, hasMore, poolExhausted } = await fetchAction(
    api.search.searchByText,
    {
      query: decodedTerm,
      genres: filters.genres.length ? filters.genres : undefined,
      platforms: filters.platforms.length ? filters.platforms : undefined,
      minRating: filters.minRating,
      yearFrom: filters.yearFrom,
      yearTo: filters.yearTo,
      sort: filters.sort,
      limit: filters.limit,
    },
  );

  return (
    <div className="min-h-screen">
      <div className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto">
          {/* Search Results Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 bg-primary/20 rounded-full">
                <MagnifyingGlassIcon className="h-8 w-8 text-primary" />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Search Results
            </h1>

            <div className="bg-card border border-border rounded-2xl p-6 max-w-3xl mx-auto">
              <p className="text-lg text-foreground mb-2">
                AI-powered recommendations for:
              </p>
              <div className="inline-block px-4 py-2 bg-primary/10 rounded-xl border border-border">
                <span className="text-xl font-semibold text-primary">
                  &quot;{decodedTerm}&quot;
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Showing {results.length} game{results.length === 1 ? "" : "s"}{" "}
                using vector similarity search
              </p>
            </div>
          </div>

          {/* Filters */}
          <SearchFilters filters={filters} />

          {/* Results Grid */}
          {results.length > 0 ? (
            <>
              {/* Results Counter and Sort Info */}
              <div className="flex justify-between items-center mb-8 px-4">
                <div className="text-muted-foreground">
                  <span className="text-foreground font-semibold">
                    {results.length}
                  </span>{" "}
                  game{results.length === 1 ? "" : "s"} shown
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <ArrowPathIcon className="h-4 w-4" />
                  <span>
                    Sorted by{" "}
                    {filters.sort === "relevance"
                      ? "AI relevance"
                      : filters.sort}
                  </span>
                </div>
              </div>

              {/* Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {results.map((game, index) => (
                  <div key={game._id} className="relative group">
                    <GamePoster game={game} index={index + 1} />
                  </div>
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="flex justify-center mt-12">
                  <Link
                    href={buildSearchHref(decodedTerm, filters, {
                      limit: filters.limit + DEFAULT_LIMIT,
                    })}
                    scroll={false}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
                  >
                    <PlusIcon className="h-5 w-5" />
                    Load more games
                  </Link>
                </div>
              )}

              {/* Pool Exhausted Hint */}
              {!hasMore && poolExhausted && (
                <div className="flex items-center justify-center gap-2 mt-12 text-sm text-muted-foreground">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <span>
                    Results may be limited — refine your search or filters to
                    surface more matches.
                  </span>
                </div>
              )}
            </>
          ) : (
            /* No Results State */
            <div className="text-center py-20">
              <div className="bg-card border border-border rounded-2xl p-12 max-w-2xl mx-auto">
                <div className="text-6xl mb-6">🎮</div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  No games found
                </h3>
                <p className="text-muted-foreground mb-8">
                  Try adjusting your filters or search terms, or browse our
                  featured games instead.
                </p>
                <div className="space-y-4">
                  <a
                    href="/"
                    className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
                  >
                    Browse Featured Games
                  </a>
                  <div className="text-sm text-muted-foreground">
                    or try searching for: &quot;action adventure&quot;,
                    &quot;puzzle games&quot;, &quot;multiplayer&quot;
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchTerm;
