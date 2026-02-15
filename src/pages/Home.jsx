import "../styles/home.css";
import MoviesGrid from "../components/movie/MoviesGrid";
import MovieCard from "../components/movie/MovieCard";

export default function Home() {
  return (
    <div className="home-container">
      <h1 className="title">Reimagine Your Favorite Stories</h1>
      <p className="sub-title">
        Explore anime worlds, watch iconic scenes, and rewrite the narrative as
        the character or creator
      </p>
      <MovieCard
        title="Neon Dreams"
        image="https://picsum.photos/400/600?1"
        type="movie"
        trending={true}
      />

      <MovieCard
        title="Spirit Chronicles"
        image="https://picsum.photos/400/600?2"
        type="series"
        trending={true}
      />
    </div>
  );
}
