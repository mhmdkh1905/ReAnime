# ReAnime - Creative Anime Community Platform

ReAnime is a community-driven web platform designed for anime fans. It transforms passive anime watching into an active, creative experience where users participate in storytelling rather than only consuming content.

## Features

- **Explore Anime**: Browse a curated collection of anime movies and series
- **Watch Clips**: View short video clips and trailers for each title
- **Read Scenarios**: Dive into key story scenario summaries
- **Creative Writing**: Rewrite scenarios from your own perspective
  - **Actor Mode**: Imagine yourself inside the story as a character
  - **Creator Mode**: Rewrite the plot as the author
- **Community Engagement**: Interact with other creative fans through likes, dislikes, and comments

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## Tech Stack

- **Frontend**: React + Vite
- **Styling**: CSS with responsive design
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Routing**: React Router

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── homeSections/   # Home page sections
│   ├── layout/         # Layout components (navbar, footer)
│   └── movie/          # Movie-related components
├── pages/              # Page components
│   ├── admin/          # Admin dashboard
│   ├── home/           # Home page
│   ├── login-register/ # Authentication pages
│   ├── movie/          # Movie detail page
│   └── profile/        # User profile page
├── services/           # API services
├── context/            # React context providers
└── router/             # Route configuration
```

## User Experience

The experience is designed to be simple, immersive, and community-focused:

1. **Homepage**: Browse a grid of anime movies and series
2. **Movie Detail**: Select a title to view video clips and scenario summaries
3. **Creative Writing**: Submit your own interpretation through a clear writing interface
4. **Community**: Engage with other users' creative works through feedback and discussion

## Contributing

We welcome contributions from the community! Feel free to submit pull requests or create issues for bug reports and feature suggestions.

## License

This project is for educational and personal use.
