import "../styles/home.css";
import MovieCard from "../components/movie/MovieCard.jsx";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig.js";

export default function Home() {
  const { currentUser, userLoggedIn } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="home">
      <div className="content">
        <p className="title">Reimagine Your Favorite Stories</p>
        <p className="description">
          Explore anime worlds, watch iconic scenes, and rewrite the narrative
          as the character or creator.
        </p>
      </div>
      <div className="MoviesGrid">
        <MovieCard
          title="Neon Dreams"
          image="https://img.freepik.com/premium-photo/flying-popcorn-3d-glasses-film-reel-clapboard-yellow-background-cinema-movie-concept-3d_989822-1302.jpg?semt=ais_wordcount_boost&w=740&q=80"
          type="Action"
          trending="true"
        />
      </div>
    </div>
  );
}
