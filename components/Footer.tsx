function Footer() {
  return (
    <footer className="relative z-10 mt-16 py-8 border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4">
          <div className="flex flex-wrap justify-center items-center gap-2 text-sm text-muted-foreground">
            <span className="text-muted-foreground font-medium">Developed by</span>
            <a
              href="https://github.com/shadeiskndr"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-card/50 rounded-full hover:bg-primary/20 hover:text-primary transition-all duration-200 border border-border hover:border-primary/50"
            >
              Shahathir Iskandar
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Game Recommender
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
