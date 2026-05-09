import { GameDescription } from "@/components/GameDescription";
import GamePoster from "@/components/GamePoster";
import ImageWithFallback from "@/components/ImageWithFallback";
import { TagsSection } from "@/components/TagsSection";
import { fetchQuery, fetchAction } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import {
  CalendarIcon,
  StarIcon,
  ClockIcon,
  DevicePhoneMobileIcon,
  ChartBarIcon,
  TagIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { notFound } from "next/navigation";

export const revalidate = 86400;

type GamePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function GamePage({ params: paramsPromise }: GamePageProps) {
  const params = await paramsPromise;
  const { slug } = params;
  const decodedSlug = decodeURIComponent(slug);

  const [game, similarGames] = await Promise.all([
    fetchQuery(api.games.bySlug, { slug: decodedSlug }),
    fetchAction(api.games.similarToSlug, { slug: decodedSlug, limit: 6 }),
  ]);

  if (!game) {
    return notFound();
  }

  const cleanDescription = game.description
    ? game.description
    : "No description available. This might affect similarity ratings, but you can still use search to find similar games.";

  // Function to get star color based on rating
  const getStarColor = (rating: number) => {
    if (rating >= 4.0) return "text-green-400"; // Excellent
    if (rating >= 3.5) return "text-yellow-400"; // Very Good
    if (rating >= 3.0) return "text-orange-400"; // Good
    if (rating >= 2.5) return "text-red-400"; // Average
    return "text-red-800"; // Below Average
  };

  // Function to get metacritic score color
  const getMetacriticColor = (score: number) => {
    if (score >= 75)
      return "text-green-400 bg-green-400/10 border-green-400/30";
    if (score >= 50)
      return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
    return "text-red-400 bg-red-400/10 border-red-400/30";
  };

  return (
    <div className="min-h-screen">
      {/* Game Hero Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Game Image */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-sm border border-border group">
                <ImageWithFallback
                  src={game.background_image}
                  alt={game.name}
                  className="w-full h-80 sm:h-96 lg:h-152.5"
                  imageClassName="object-cover lg:object-contain transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1280px) 100vw, 50vw"
                  loading="eager"
                />
              </div>
            </div>

            {/* Game Info */}
            <div className="space-y-6 lg:space-y-8">
              {/* Title and Genre */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight">
                    {game.name}
                  </h1>
                </div>

                {game.genres && (
                  <div className="flex flex-wrap gap-2">
                    {game.genres.split(", ").map((genre, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full text-sm border border-border"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Game Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Release Date */}
                <div className="bg-card border border-border rounded-xl p-4 space-y-3 hover:bg-card/60 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <CalendarIcon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-muted-foreground text-sm font-medium">
                      Release Date
                    </span>
                  </div>
                  <p className="text-foreground font-semibold text-lg">
                    {game.released || "Unknown"}
                  </p>
                </div>

                {/* User Rating */}
                <div className="bg-card border border-border rounded-xl p-4 space-y-3 hover:bg-card/60 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <StarIcon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-muted-foreground text-sm font-medium">
                      User Rating
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <p className="text-foreground font-semibold text-lg">
                      {game.rating || "N/A"}
                    </p>
                    {game.rating && (
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <StarIconSolid
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(parseFloat(game.rating))
                                ? getStarColor(parseFloat(game.rating))
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Metacritic Score */}
                <div className="bg-card border border-border rounded-xl p-4 space-y-3 hover:bg-card/60 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <ChartBarIcon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-muted-foreground text-sm font-medium">
                      Critic Score
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {game.metacritic ? (
                      <span
                        className={`px-3 py-1.5 rounded-lg text-sm font-bold border ${getMetacriticColor(
                          parseInt(game.metacritic)
                        )}`}
                      >
                        {game.metacritic}
                      </span>
                    ) : (
                      <span className="text-foreground font-semibold text-lg">
                        N/A
                      </span>
                    )}
                  </div>
                </div>

                {/* Playtime */}
                <div className="bg-card border border-border rounded-xl p-4 space-y-3 hover:bg-card/60 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <ClockIcon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-muted-foreground text-sm font-medium">
                      Avg Playtime
                    </span>
                  </div>
                  <p className="text-foreground font-semibold text-lg">
                    {game.playtime ? `${game.playtime} hours` : "Unknown"}
                  </p>
                </div>
              </div>

              {/* Platforms */}
              {game.platforms && (
                <div className="bg-card border border-border rounded-xl p-4 space-y-3 hover:bg-card/60 transition-colors -mt-2 lg:mt-[-0.8rem]">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <DevicePhoneMobileIcon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-muted-foreground text-sm font-medium">
                      Available Platforms
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {game.platforms.split(", ").map((platform, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-primary/20 text-primary rounded-lg text-sm border border-primary/30 hover:bg-primary/30 transition-colors"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Game Description */}
          <div className="mt-4 lg:mt-6">
            <div className="bg-card border border-border rounded-2xl p-6 lg:p-8 hover:bg-card/60 transition-colors">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <BookOpenIcon className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  About This Game
                </h2>
                <div className="flex-1 h-px bg-border"></div>
              </div>
              <GameDescription description={cleanDescription} />
            </div>
          </div>

          {/* Enhanced Information Grid */}
          <div className="mt-4 space-y-4">
            {/* Tags Section */}
            {game.tags && (
              <div className="bg-card border border-border rounded-2xl p-6 lg:p-8 hover:bg-card/60 transition-colors">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <TagIcon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Game Tags</h3>
                  <div className="flex-1 h-px bg-border"></div>
                </div>
                <TagsSection tags={game.tags} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Similar Games Section */}
      {similarGames.length > 0 && (
        <div className="px-4 sm:px-6 lg:px-8 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-6 mt-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Similar Games You Might Like
              </h2>
            </div>

            {/* Horizontal Scrolling Container */}
            <div className="relative">
              {/* Scroll Indicators */}
              <div className="absolute left-0 top-0 bottom-0 w-8  z-10 pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-8  z-10 pointer-events-none"></div>

              {/* Scrollable Games Container */}
              <div className="overflow-x-auto pb-4">
                <div
                  className="flex space-x-6 px-4 py-4"
                  style={{ width: "max-content" }}
                >
                  {similarGames.map((similarGame, index) => (
                    <div key={similarGame._id} className="shrink-0 w-80">
                      <GamePoster
                        game={similarGame}
                        index={index + 1}
                        similarityRating={Math.round(
                          (similarGame._score || 0) * 100
                        )}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Scroll Hint */}
              <div className="text-center mt-4">
                <p className="text-muted-foreground text-sm flex items-center justify-center space-x-2">
                  <span>←</span>
                  <span>Scroll horizontally to see more games</span>
                  <span>→</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GamePage;
