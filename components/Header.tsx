import SearchInput from "./SearchInput";

function Header() {
  return (
    <header className="relative p-4 sm:p-6 md:p-8 pb-2">
      {/* Hero Section */}
      <div className="text-center mb-6 sm:mb-8 space-y-4">
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold gradient-text leading-tight px-2">
            <span className="hidden sm:inline">AI Game Recommender</span>
            <span className="sm:hidden">
              AI Game
              <br />
              Recommender
            </span>
          </h1>
          <div className="w-16 sm:w-20 md:w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
        </div>

        <div className="space-y-3 max-w-4xl mx-auto px-4">
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 font-light">
            Discover your next favorite game with AI-powered recommendations
          </p>
          <p className="text-sm sm:text-base md:text-lg text-gray-400">
            Over 20,000 video game titles recognized by AI for intelligent
            vector search
          </p>
        </div>

        {/* Tech Stack Credits */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400 px-4">
          <span className="text-gray-400 font-medium">Powered by</span>
          <a
            href="https://platform.openai.com/docs/guides/embeddings"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 sm:px-3 py-1 bg-dark-800/50 rounded-full hover:bg-primary-600/20 hover:text-primary-300 transition-all duration-200 border border-dark-700 hover:border-primary-500/50"
          >
            OpenAI
          </a>
          <a
            href="https://www.convex.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 sm:px-3 py-1 bg-dark-800/50 rounded-full hover:bg-secondary-600/20 hover:text-secondary-300 transition-all duration-200 border border-dark-700 hover:border-secondary-500/50"
          >
            Convex
          </a>
          <a
            href="https://rawg.io/apidocs"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 sm:px-3 py-1 bg-dark-800/50 rounded-full hover:bg-accent-600/20 hover:text-accent-300 transition-all duration-200 border border-dark-700 hover:border-accent-500/50"
          >
            RAWG
          </a>
        </div>
      </div>

      <SearchInput />
    </header>
  );
}

export default Header;
