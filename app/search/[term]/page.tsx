import GamePoster from "@/components/GamePoster";
import { fetchAction } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

export const revalidate = 86400;

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
}: SearchTermProps) {
  const params = await paramsPromise;
  const { term } = params;
  const decodedTerm = decodeURIComponent(term);

  const similarGames = await fetchAction(api.search.searchByText, {
    query: decodedTerm,
    limit: 12,
  });

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
                Found {similarGames.length} games using vector similarity search
              </p>
            </div>
          </div>

          {/* Results Grid */}
          {similarGames.length > 0 ? (
            <>
              {/* Results Counter and Sort Info */}
              <div className="flex justify-between items-center mb-8 px-4">
                <div className="text-muted-foreground">
                  <span className="text-foreground font-semibold">
                    {similarGames.length}
                  </span>{" "}
                  games found
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <ArrowPathIcon className="h-4 w-4" />
                  <span>Sorted by AI relevance</span>
                </div>
              </div>

              {/* Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {similarGames.map((game, index) => (
                  <div key={game._id} className="relative group">
                    <GamePoster game={game} index={index + 1} />
                  </div>
                ))}
              </div>
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
                  Try adjusting your search terms or browse our featured games
                  instead.
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
