import GamePoster from "@/components/GamePoster";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import ScrollToTopButton from "@/components/ScrollToTopButton";

// refresh cache every 24 hours
export const revalidate = 86400;

export default async function Home() {
  const allGames = await fetchQuery(api.games.featured, { limit: 12 });

  return (
    <div className="min-h-screen">
      {/* Featured Games Section */}
      <div className="px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-300 mb-4">
              Featured Games
            </h2>
            <div className="w-20 h-1 bg-linear-to-r from-primary-500 to-secondary-500 mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover video games, handpicked for you
            </p>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allGames.map((game) => (
              <div key={game._id} className="relative">
                <GamePoster game={game} />
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="glass-effect rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">
                Looking for something specific?
              </h3>
              <p className="text-gray-300 mb-6">
                Use our AI-powered search to find games that match your exact
                preferences
              </p>
              <div className="flex justify-center">
                <ScrollToTopButton className="px-6 py-3 bg-linear-to-r from-primary-600 to-secondary-600 rounded-xl text-white font-medium hover:from-primary-700 hover:to-secondary-700 transition-all duration-200 cursor-pointer">
                  Try searching above ↑
                </ScrollToTopButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
