import { db } from "../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

const moviesCollection = collection(db, "movies");


export const createMovie = async (movieData) => {
  try {
    if (!movieData.title) {
      throw new Error("Title is required");
    }
    if (!movieData.description) {
      throw new Error("Description is required");
    }
    if (!movieData.releaseYear) {
      throw new Error("Release Year is required");
    }
    if (!movieData.rating) {
      throw new Error("Rating is required");
    }
    if (!movieData.genre) {
      throw new Error("Genre is required");
    }

    const docRef = await addDoc(moviesCollection, {
      title: movieData.title,
      description: movieData.description,
      image: movieData.image || "",
      trailerURL: movieData.trailerURL || "",
      genre: movieData.genre,
      rating: movieData.rating,
      releaseYear: movieData.releaseYear,
      createdBy: movieData.createdBy || null,
      createdByName: movieData.createdByName || "",
      likesCount: 0,
      viewsCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error creating movie:", error);
    throw error;
  }
};


export const getAllMovies = async () => {
  try {
    const q = query(moviesCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
};


export const getMovieById = async (movieId) => {
  try {
    const movieRef = doc(db, "movies", movieId);
    const snapshot = await getDoc(movieRef);

    if (!snapshot.exists()) return null;

    return { id: snapshot.id, ...snapshot.data() };
  } catch (error) {
    console.error("Error fetching movie:", error);
    throw error;
  }
};


export const updateMovie = async (movieId, updatedData) => {
  try {
    const movieRef = doc(db, "movies", movieId);

    await updateDoc(movieRef, {
      ...updatedData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating movie:", error);
    throw error;
  }
};


export const deleteMovie = async (movieId) => {
  try {
    const movieRef = doc(db, "movies", movieId);
    await deleteDoc(movieRef);
  } catch (error) {
    console.error("Error deleting movie:", error);
    throw error;
  }
};
