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
              <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
                <ImageWithFallback
                  src={game.background_image}
                  alt={game.name}
                  className="w-full h-80 sm:h-96 lg:h-[610px]"
                  imageClassName="object-cover lg:object-contain transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1280px) 100vw, 50vw"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 via-transparent to-dark-900/20"></div>
              </div>
            </div>

            {/* Game Info */}
            <div className="space-y-6 lg:space-y-8">
              {/* Title and Genre */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
                    {game.name}
                  </h1>
                </div>

                {game.genres && (
                  <div className="flex flex-wrap gap-2">
                    {game.genres.split(", ").map((genre, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-gradient-to-r from-primary-600/20 to-primary-500/20 text-primary-300 rounded-full text-sm border border-primary-500/30 hover:border-primary-400/50 transition-colors"
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
                <div className="glass-effect rounded-xl p-4 space-y-3 hover:bg-dark-800/60 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary-500/20 rounded-lg">
                      <CalendarIcon className="h-5 w-5 text-primary-400" />
                    </div>
                    <span className="text-gray-300 text-sm font-medium">
                      Release Date
                    </span>
                  </div>
                  <p className="text-white font-semibold text-lg">
                    {game.released || "Unknown"}
                  </p>
                </div>

                {/* User Rating */}
                <div className="glass-effect rounded-xl p-4 space-y-3 hover:bg-dark-800/60 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-secondary-500/20 rounded-lg">
                      <StarIcon className="h-5 w-5 text-secondary-400" />
                    </div>
                    <span className="text-gray-300 text-sm font-medium">
                      User Rating
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <p className="text-white font-semibold text-lg">
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
                                : "text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Metacritic Score */}
                <div className="glass-effect rounded-xl p-4 space-y-3 hover:bg-dark-800/60 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-secondary-500/20 rounded-lg">
                      <ChartBarIcon className="h-5 w-5 text-secondary-400" />
                    </div>
                    <span className="text-gray-300 text-sm font-medium">
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
                      <span className="text-white font-semibold text-lg">
                        N/A
                      </span>
                    )}
                  </div>
                </div>

                {/* Playtime */}
                <div className="glass-effect rounded-xl p-4 space-y-3 hover:bg-dark-800/60 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary-500/20 rounded-lg">
                      <ClockIcon className="h-5 w-5 text-primary-400" />
                    </div>
                    <span className="text-gray-300 text-sm font-medium">
                      Avg Playtime
                    </span>
                  </div>
                  <p className="text-white font-semibold text-lg">
                    {game.playtime ? `${game.playtime} hours` : "Unknown"}
                  </p>
                </div>
              </div>

              {/* Platforms */}
              {game.platforms && (
                <div className="glass-effect rounded-xl p-4 space-y-3 hover:bg-dark-800/60 transition-colors mt-[-0.5rem] lg:mt-[-0.8rem]">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-secondary-500/20 rounded-lg">
                      <DevicePhoneMobileIcon className="h-5 w-5 text-secondary-400" />
                    </div>
                    <span className="text-gray-300 font-semibold">
                      Available Platforms
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {game.platforms.split(", ").map((platform, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-secondary-600/20 text-secondary-300 rounded-lg text-sm border border-secondary-500/30 hover:bg-secondary-600/30 transition-colors"
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
            <div className="glass-effect rounded-2xl p-6 lg:p-8 hover:bg-dark-800/60 transition-colors">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-lg">
                  <BookOpenIcon className="h-6 w-6 text-primary-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  About This Game
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-primary-500/50 via-secondary-500/50 to-transparent"></div>
              </div>
              <GameDescription description={cleanDescription} />
            </div>
          </div>

          {/* Enhanced Information Grid */}
          <div className="mt-4 space-y-4">
            {/* Tags Section */}
            {game.tags && (
              <div className="glass-effect rounded-2xl p-6 lg:p-8 hover:bg-dark-800/60 transition-colors">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-primary-500/20 rounded-lg">
                    <TagIcon className="h-6 w-6 text-primary-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Game Tags</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-primary-500/50 to-transparent"></div>
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
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Similar Games You Might Like
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full mb-6"></div>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                AI-powered recommendations based on game similarity using
                advanced vector embeddings
              </p>
            </div>

            {/* Horizontal Scrolling Container */}
            <div className="relative">
              {/* Scroll Indicators */}
              <div className="absolute left-0 top-0 bottom-0 w-8  z-10 pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-8  z-10 pointer-events-none"></div>

              {/* Scrollable Games Container */}
              <div className="horizontal-scroll overflow-x-auto pb-4">
                <div
                  className="flex space-x-6 px-4 py-4"
                  style={{ width: "max-content" }}
                >
                  {similarGames.map((similarGame, index) => (
                    <div key={similarGame._id} className="flex-shrink-0 w-80">
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
                <p className="text-gray-500 text-sm flex items-center justify-center space-x-2">
                  <span>←</span>
                  <span>Scroll horizontally to see more games</span>
                  <span>→</span>
                </p>
              </div>
            </div>

            {/* AI Explanation */}
            <div className="mt-12 text-center">
              <div className="glass-effect rounded-xl p-6 max-w-3xl mx-auto hover:bg-dark-800/60 transition-colors">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center justify-center space-x-2">
                  <span className="text-2xl">🤖</span>
                  <span>How AI Recommendations Work</span>
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Our AI analyzes game descriptions, genres, and gameplay
                  elements using vector embeddings to find games with similar
                  characteristics. The similarity percentage shows how closely
                  each game matches the current one based on these factors.
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
