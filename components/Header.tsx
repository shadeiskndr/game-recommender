import SearchInput from "./SearchInput";
import { ModeToggle } from "./ModeToggle";

function Header() {
  return (
    <header className="relative p-4 sm:p-6 md:p-8 pb-2">
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6 md:right-8 md:top-8">
        <ModeToggle />
      </div>
      {/* Hero Section */}
      <div className="text-center mb-6 sm:mb-8 space-y-4">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight px-2">
            <span className="hidden sm:inline">Game Recommender</span>
            <span className="sm:hidden">
              Game
              <br />
              Recommender
            </span>
          </h1>
        </div>

        <div className="space-y-1 max-w-4xl mx-auto px-4">
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
            Discover your next favorite game from over 20,000 titles
          </p>
        </div>

        {/* Tech Stack Credits */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground px-4">
          <span className="text-muted-foreground font-medium">Powered by</span>
          <a
            href="https://platform.openai.com/docs/guides/embeddings"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 sm:px-3 py-1 bg-card/50 rounded-full hover:bg-primary/20 hover:text-primary transition-all duration-200 border border-muted-foreground/50 hover:border-primary/50"
          >
            OpenAI
          </a>
          <a
            href="https://www.convex.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 sm:px-3 py-1 bg-card/50 rounded-full hover:bg-primary/20 hover:text-primary transition-all duration-200 border border-muted-foreground/50 hover:border-primary/50"
          >
            Convex
          </a>
          <a
            href="https://rawg.io/apidocs"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 sm:px-3 py-1 bg-card/50 rounded-full hover:bg-primary/20 hover:text-primary transition-all duration-200 border border-muted-foreground/50 hover:border-primary/50"
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
