import { db } from "../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp, // <- fixed import
} from "firebase/firestore";

const scenarioCollection = collection(db, "scenarios");

/* ==============================
   CREATE SCENARIO
============================== */
export const createScenario = async ({
  movieId,
  movieTitle,
  title,
  content,
  user, // expects { uid, name, photoURL }
}) => {
  try {
    // Basic validation
    if (!movieId || !title || !content || !user?.uid) {
      throw new Error("Missing required fields");
    }

    const scenarioData = {
      movieId,
      movieTitle,
      title,
      titleLowercase: title.toLowerCase(),
      content,

      // User info
      createdBy: user.uid,
      createdByName: user.name || user.displayName || "Anonymous",
      userPhotoURL: user.photoURL || "",

      // Stats
      likesCount: 0,
      dislikesCount: 0,
      commentsCount: 0,
      viewsCount: 0,
      reportCount: 0,

      // Status
      status: "published",
      isEdited: false,

      // Timestamps
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(scenarioCollection, scenarioData);

    return {
      success: true,
      id: docRef.id,
    };
  } catch (error) {
    console.error("Error creating scenario:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/* ==============================
   READ ALL SCENARIOS
============================== */
export const getAllScenarios = async () => {
  const snapshot = await getDocs(scenarioCollection);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

/* ==============================
   READ SCENARIOS BY MOVIE
============================== */
export const getScenariosByMovie = async (movieId) => {
  const q = query(scenarioCollection, where("movieId", "==", movieId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

/* ==============================
   UPDATE SCENARIO
============================== */
export const updateScenario = async (id, updatedData) => {
  const docRef = doc(db, "scenarios", id);
  updatedData.updatedAt = serverTimestamp(); // auto-update timestamp
  return await updateDoc(docRef, updatedData);
};

/* ==============================
   DELETE SCENARIO
============================== */
export const deleteScenario = async (id) => {
  const docRef = doc(db, "scenarios", id);
  return await deleteDoc(docRef);
};
