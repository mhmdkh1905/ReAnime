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
  serverTimestamp,
  increment,
  getDoc,
} from "firebase/firestore";

import { updateUser } from "./usersService";

const scenarioCollection = collection(db, "scenarios");
const scenarioReactionsCollection = collection(db, "scenarioReactions");
//`scenarioReactionsCollection` here duplicates the concern handled in `scenarioReactionService.js`. This is an architecture smell.

export const createScenario = async ({
  movieId,
  movieTitle,
  title,
  content,
  user,
}) => {
  try {
    if (!movieId || !title || !content || !user?.uid) {
      throw new Error("Missing required fields");
    }

    const scenarioData = {
      movieId,
      movieTitle,
      title,
      titleLowercase: title.toLowerCase(),
      content,

      createdBy: user.uid,
      createdByName: user.name || user.displayName || "Anonymous",
      userPhotoURL: user.photoURL || "",

      likesCount: 0,
      dislikesCount: 0,
      commentsCount: 0,
      viewsCount: 0,
      reportCount: 0,

      status: "published",
      isEdited: false,

      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(scenarioCollection, scenarioData);

    updateUser(user.uid, {
      totalPosterScenarios: increment(1),
    });
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

export const getAllScenarios = async () => {
  const snapshot = await getDocs(scenarioCollection);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getScenariosByMovie = async (movieId) => {
  const q = query(scenarioCollection, where("movieId", "==", movieId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const updateScenario = async (id, updatedData) => {
  const docRef = doc(db, "scenarios", id);
  updatedData.updatedAt = serverTimestamp();
  return await updateDoc(docRef, updatedData);
};

export const deleteScenario = async (id) => {
  const docRef = doc(db, "scenarios", id);
  const scenario = await getDoc(docRef);
  if (scenario.exists()) {
    const scenarioData = scenario.data();
    updateUser(scenarioData.createdBy, {
      totalPosterScenarios: increment(-1),
    });

    if (scenarioData.likesCount > 0) {
      updateUser(scenarioData.createdBy, {
        totalLikes: increment(-scenarioData.likesCount),
      });
    }
  }
  return await deleteDoc(docRef);
};

export const getScenariosByUserId = async (userId) => {
  const q = query(scenarioCollection, where("createdBy", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const createScenarioReaction = async ({ scenarioId, userId, type }) => {
  try {
    if (!scenarioId || !userId || !type) {
      throw new Error("Missing required fields");
    }

    const scenarioDoc = await getDoc(doc(db, "scenarios", scenarioId));
    if (!scenarioDoc.exists()) {
      throw new Error("Scenario not found");
    }
    const scenarioData = scenarioDoc.data();
    const scenarioCreatorId = scenarioData.createdBy;

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
        await deleteDoc(doc(db, "scenarioReactions", existingDoc.id));

        if (type === "like") {
          await updateDoc(scenarioRef, { likesCount: increment(-1) });

          if (scenarioCreatorId && scenarioCreatorId !== userId) {
            updateUser(scenarioCreatorId, { totalLikes: increment(-1) });
          }
        } else {
          await updateDoc(scenarioRef, { dislikesCount: increment(-1) });
        }

        return { success: true, id: existingDoc.id, removed: true };
      } else {
        await updateDoc(doc(db, "scenarioReactions", existingDoc.id), {
          type,
          createdAt: serverTimestamp(),
        });

        if (type === "like") {
          await updateDoc(scenarioRef, {
            likesCount: increment(1),
            dislikesCount: increment(-1),
          });

          if (scenarioCreatorId && scenarioCreatorId !== userId) {
            updateUser(scenarioCreatorId, { totalLikes: increment(1) });
          }
        } else {
          await updateDoc(scenarioRef, {
            likesCount: increment(-1),
            dislikesCount: increment(1),
          });

          if (scenarioCreatorId && scenarioCreatorId !== userId) {
            updateUser(scenarioCreatorId, { totalLikes: increment(-1) });
          }
        }

        return { success: true, id: existingDoc.id, updated: true };
      }
    }

    const reactionData = {
      scenarioId,
      userId,
      type,
      createdAt: serverTimestamp(),
    };
    const docRef = await addDoc(scenarioReactionsCollection, reactionData);

    if (type === "like") {
      await updateDoc(scenarioRef, { likesCount: increment(1) });

      if (scenarioCreatorId && scenarioCreatorId !== userId) {
        updateUser(scenarioCreatorId, { totalLikes: increment(1) });
      }
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

//very large file
