import GamePoster from "@/components/GamePoster";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export const revalidate = 86400;

export default async function Home() {
  const allGames = await fetchQuery(api.games.featured, { limit: 12 });

  return (
    <div className="min-h-screen">
      <div className="px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Featured Games
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allGames.map((game) => (
              <div key={game._id} className="relative">
                <GamePoster game={game} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
