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
      <div className="relative transition-transform duration-300 hover:-translate-y-2">
        {/* Game Image */}
        <div className="relative overflow-hidden rounded-xl bg-card border border-border">
          <ImageWithFallback
            className="w-full h-64"
            imageClassName="object-cover group-hover:scale-105 transition-transform duration-500"
            src={game.background_image}
            alt={game.name}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
          />

          {/* Similarity Rating Badge */}
          {similarityRating && (
            <div className="absolute top-3 right-3 group/tooltip">
              <div className="flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg cursor-help">
                <span className="font-bold text-sm">
                  {similarityRating}%
                </span>
              </div>

              {/* Tooltip */}
              <div className="absolute top-full right-0 mt-2 px-3 py-2 bg-card text-foreground text-xs rounded-lg shadow-lg border border-border whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                <div className="relative">Similarity Rating</div>
              </div>
            </div>
          )}

          {/* Large Index for Search Results */}
          {index && !similarityRating && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-8xl font-black text-foreground/10 group-hover:text-foreground/20 transition-colors duration-300">
                {index}
              </span>
            </div>
          )}
        </div>

        {/* Game Info Card */}
        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
            {game.name}
          </h3>
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <p className="text-muted-foreground text-sm line-clamp-1">
                {game.genres}
              </p>
            </div>
            {/* Rating if available */}
            {game.rating && (
              <div className="flex items-center space-x-1 text-xs">
                <StarIcon
                  className={`w-3 h-3 ${getStarColor(parseFloat(game.rating))}`}
                />
                <span className="text-muted-foreground">{game.rating}/5</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default GamePoster;
