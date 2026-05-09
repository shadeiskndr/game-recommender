<h1 align="center">
  🎮 Game Recommender
</h1>

<p align="center">
  <strong>Discover your next favorite game with AI-powered recommendations</strong>
</p>

<p align="center">
  A modern video game recommendation web application that leverages vector embeddings and machine learning to suggest games based on your preferences and gaming history.
</p>

<p align="center">
  <a href="https://ai-game-recommender.netlify.app" target="_blank">🚀 Live Demo</a>
</p>

---

## ✨ Features

- **AI-Powered Recommendations** - Advanced vector similarity search using OpenAI embeddings
- **Comprehensive Game Database** - Powered by RAWG API with extensive game catalog
- **Intelligent Search** - Find games by title, genre, or description
- **Detailed Game Information** - Rich game details, screenshots, and metadata
- **Responsive Design** - Optimized for desktop and mobile devices
- **Fast Performance** - Built with Next.js 15 and React 19 for optimal speed

## 🛠️ Tech Stack

### Frontend

- **[Next.js 15](https://nextjs.org)** - React framework with App Router
- **[React 19](https://react.dev/)** - Latest React with concurrent features
- **[TypeScript](https://typescriptlang.org)** - Type-safe development
- **[Tailwind CSS 4](https://tailwindcss.com)** - CSS-first configuration styling

### Backend & AI

- **[DataStax Astra DB](https://www.datastax.com/)** - Vector database for similarity search
- **[Open AI](https://openai.com)** - Vector embeddings and AI processing
- **[RAWG API](https://rawg.io/apidocs)** - Game data and metadata source

### Deployment

- **[Netlify](https://www.netlify.com/)** - Serverless deployment platform

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- DataStax Astra DB account
- OpenAI API key

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/shadeiskndr/AI-Game-Recommender.git
cd AI-Game-Recommender
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env` with your API keys:

```env
ASTRA_DB_APPLICATION_TOKEN=your_astra_token
ASTRA_DB_API_ENDPOINT=your_astra_endpoint
```

4. **Run the development server**

```bash
npm run dev
```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 How It Works

1. **Data Ingestion**: Game data from RAWG API is processed and stored in Astra DB
2. **Vector Embeddings**: Mistral AI generates embeddings for game descriptions and metadata
3. **Similarity Search**: User queries are converted to vectors and matched against the database
4. **Recommendations**: Similar games are returned based on vector similarity scores
5. **Rich Display**: Results are presented with detailed game information and visuals

## 🔧 Configuration

### Tailwind CSS 4 Setup

This project uses the new CSS-first configuration approach:

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  /* Custom design tokens can be added here */
  --color-brand-500: oklch(0.84 0.18 117.33);
  --font-display: "Inter", "sans-serif";
}
```

No `tailwind.config.js` file is needed with v4!

## 🚀 Deployment

### Netlify Deployment

1. **Connect your repository** to Netlify
2. **Set environment variables** in Netlify dashboard
3. **Deploy** - Netlify will automatically build and deploy

Build settings:

- Build command: `npm run build`
- Publish directory: `.next`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## ⚠️ Known Issues

- If the web app is not working, it may be due to:
  - OpenAI API rate limits or expired free trial
  - DataStax Astra database connectivity issues
  - RAWG API rate limiting

## 🙏 Acknowledgments

- [RAWG](https://rawg.io) for providing comprehensive game data
- [DataStax](https://datastax.com) for vector database capabilities
- [OpenAI](https://openai.com) for embedding generation
- [Netlify](https://netlify.com) for seamless deployment

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/shadeiskndr">shadeiskndr</a>
</p>

<p align="center">
  <strong>Part of the Catalogd-FYP project</strong>
</p>
