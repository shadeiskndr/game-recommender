import { Game, SimilarGame } from "@/lib/types";
import Link from "next/link";
import ImageWithFallback from "./ImageWithFallback";
import { StarIcon } from "@heroicons/react/24/solid";

function GamePoster({
  index,
  similarityRating,
  game,
}: {
  index?: number;
  similarityRating?: number;
  game: Game | SimilarGame;
}) {
  // Function to get star color based on rating
  const getStarColor = (rating: number) => {
    if (rating >= 4.0) return "text-green-400"; // Excellent
    if (rating >= 3.5) return "text-yellow-400"; // Very Good
    if (rating >= 3.0) return "text-orange-400"; // Good
    if (rating >= 2.5) return "text-red-400"; // Average
    return "text-red-800"; // Below Average
  };

  return (
    <Link href={`/game/${game.slug}`} className="group block">
      <div className="relative">
        {/* Game Image */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-dark-800 to-dark-900 game-card-hover">
          <ImageWithFallback
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
            src={game.background_image}
            alt={game.name}
            width={400}
            height={256}
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Similarity Rating Badge */}
          {similarityRating && (
            <div className="absolute top-3 right-3 group/tooltip">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full shadow-lg cursor-help">
                <span className="text-white font-bold text-sm">
                  {similarityRating}%
                </span>
              </div>

              {/* Tooltip */}
              <div className="absolute top-full right-0 mt-2 px-3 py-2 bg-dark-800 text-white text-xs rounded-lg shadow-lg border border-dark-700 whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                <div className="relative">Similarity Rating</div>
              </div>
            </div>
          )}

          {/* Large Index for Search Results */}
          {index && !similarityRating && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-8xl font-black text-white/10 group-hover:text-white/20 transition-colors duration-300">
                {index}
              </span>
            </div>
          )}
        </div>

        {/* Game Info Card */}
        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-semibold text-white group-hover:text-primary-300 transition-colors duration-200 line-clamp-2">
            {game.name}
          </h3>
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <p className="text-gray-400 text-sm line-clamp-1">
                {game.genres}
              </p>
            </div>
            {/* Rating if available */}
            {game.rating && (
              <div className="flex items-center space-x-1 text-xs">
                <StarIcon
                  className={`w-3 h-3 ${getStarColor(parseFloat(game.rating))}`}
                />
                <span className="text-gray-400">{game.rating}/5</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default GamePoster;
