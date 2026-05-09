import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function Loading() {
  return (
    <div className="min-h-screen pb-20">
      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Loading Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-primary/20 rounded-full animate-pulse">
                <MagnifyingGlassIcon className="h-8 w-8 text-primary" />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Searching Games...
            </h1>

            <div className="bg-card border border-border rounded-2xl p-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
              <p className="text-lg text-muted-foreground">
                AI is analyzing your search...
              </p>
            </div>
          </div>

          {/* Loading Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-card/50 rounded-lg h-64 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-card/50 rounded w-3/4"></div>
                  <div className="h-3 bg-card/50 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
