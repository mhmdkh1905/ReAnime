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
  increment,
  getDoc,
} from "firebase/firestore";

const scenarioCollection = collection(db, "scenarios");
const scenarioReactionsCollection = collection(db, "scenarioReactions");

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

/* ==============================
   READ SCENARIOS BY USER ID
============================== */
export const getScenariosByUserId = async (userId) => {
  const q = query(scenarioCollection, where("createdBy", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

/* ==============================
  CREATE SCENARIO REACTION
============================== */
export const createScenarioReaction = async ({
  scenarioId,
  userId,
  type, // "like" or "dislike"
}) => {
  try {
    if (!scenarioId || !userId || !type) {
      throw new Error("Missing required fields");
    }

    const snapshot = await getDocs(
      query(
        scenarioReactionsCollection,
        where("scenarioId", "==", scenarioId),
        where("userId", "==", userId),
      ),
    );

    const scenarioRef = doc(db, "scenarios", scenarioId);

    if (!snapshot.empty) {
      const existingDoc = snapshot.docs[0];
      const existingData = existingDoc.data();

      if (existingData.type === type) {
        // Remove reaction (toggle off)
        await deleteDoc(doc(db, "scenarioReactions", existingDoc.id));

        // Decrement the appropriate counter
        if (type === "like") {
          await updateDoc(scenarioRef, { likesCount: increment(-1) });
        } else {
          await updateDoc(scenarioRef, { dislikesCount: increment(-1) });
        }

        return { success: true, id: existingDoc.id, removed: true };
      } else {
        // Change reaction type (e.g., from dislike to like)
        await updateDoc(doc(db, "scenarioReactions", existingDoc.id), {
          type,
          createdAt: serverTimestamp(),
        });

        // Decrement old type, increment new type
        if (type === "like") {
          await updateDoc(scenarioRef, {
            likesCount: increment(1),
            dislikesCount: increment(-1),
          });
        } else {
          await updateDoc(scenarioRef, {
            likesCount: increment(-1),
            dislikesCount: increment(1),
          });
        }

        return { success: true, id: existingDoc.id, updated: true };
      }
    }

    // First time reaction - add new
    const reactionData = {
      scenarioId,
      userId,
      type,
      createdAt: serverTimestamp(),
    };
    const docRef = await addDoc(scenarioReactionsCollection, reactionData);

    // Increment the appropriate counter
    if (type === "like") {
      await updateDoc(scenarioRef, { likesCount: increment(1) });
    } else {
      await updateDoc(scenarioRef, { dislikesCount: increment(1) });
    }

    return {
      success: true,
      id: docRef.id,
    };
  } catch (error) {
    console.error("Error creating scenario reaction:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/* ==============================
  GET SCENARIO REACTIONS BY USER ID
============================== */
export const getScenarioReactionsByUserId = async (userId) => {
  const q = query(scenarioReactionsCollection, where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getScenarioById = async (id) => {
  const docRef = doc(db, "scenarios", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    throw new Error("Scenario not found");
  }
};
