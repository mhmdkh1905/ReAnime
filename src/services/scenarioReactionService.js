import { db } from "../firebase/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  increment,
  query,
  where,
  or,
} from "firebase/firestore";

const scenarioReactionsCollection = collection(db, "scenarioReactions");

/* =======================================================
   LIKE A SCENARIO
   - Adds like, removes dislike if exists
======================================================= */
export const likeScenario = async (scenarioId, userId) => {
  if (!scenarioId || !userId) {
    return { success: false, error: "Missing required fields" };
  }

  try {
    const likeRef = doc(scenarioReactionsCollection, `${scenarioId}_${userId}`);
    const existingReaction = await getDoc(likeRef);

    if (existingReaction.exists()) {
      const currentData = existingReaction.data();

      // If already liked, remove the like (toggle off)
      if (currentReaction.type === "like") {
        await deleteDoc(likeRef);

        // Decrement likes count
        const scenarioRef = doc(db, "scenarios", scenarioId);
        await updateDoc(scenarioRef, { likesCount: increment(-1) });

        return { success: true, action: "removed" };
      }

      // If previously disliked, change to like
      if (currentData.type === "dislike") {
        await setDoc(likeRef, {
          scenarioId,
          userId,
          type: "like",
          createdAt: serverTimestamp(),
        });

        // Decrement dislike, increment like
        const scenarioRef = doc(db, "scenarios", scenarioId);
        await updateDoc(scenarioRef, {
          likesCount: increment(1),
          dislikesCount: increment(-1),
        });

        return { success: true, action: "changed_to_like" };
      }
    }

    // First time liking
    await setDoc(likeRef, {
      scenarioId,
      userId,
      type: "like",
      createdAt: serverTimestamp(),
    });

    const scenarioRef = doc(db, "scenarios", scenarioId);
    await updateDoc(scenarioRef, { likesCount: increment(1) });

    return { success: true, action: "added" };
  } catch (error) {
    console.error("Error liking scenario:", error);
    return { success: false, error: error.message };
  }
};

/* =======================================================
   DISLIKE A SCENARIO
   - Adds dislike, removes like if exists
======================================================= */
export const dislikeScenario = async (scenarioId, userId) => {
  if (!scenarioId || !userId) {
    return { success: false, error: "Missing required fields" };
  }

  try {
    const dislikeRef = doc(
      scenarioReactionsCollection,
      `${scenarioId}_${userId}`,
    );
    const existingReaction = await getDoc(dislikeRef);

    if (existingReaction.exists()) {
      const currentData = existingReaction.data();

      // If already disliked, remove the dislike (toggle off)
      if (currentData.type === "dislike") {
        await deleteDoc(dislikeRef);

        // Decrement dislikes count
        const scenarioRef = doc(db, "scenarios", scenarioId);
        await updateDoc(scenarioRef, { dislikesCount: increment(-1) });

        return { success: true, action: "removed" };
      }

      // If previously liked, change to dislike
      if (currentData.type === "like") {
        await setDoc(dislikeRef, {
          scenarioId,
          userId,
          type: "dislike",
          createdAt: serverTimestamp(),
        });

        // Decrement like, increment dislike
        const scenarioRef = doc(db, "scenarios", scenarioId);
        await updateDoc(scenarioRef, {
          likesCount: increment(-1),
          dislikesCount: increment(1),
        });

        return { success: true, action: "changed_to_dislike" };
      }
    }

    // First time disliking
    await setDoc(dislikeRef, {
      scenarioId,
      userId,
      type: "dislike",
      createdAt: serverTimestamp(),
    });

    const scenarioRef = doc(db, "scenarios", scenarioId);
    await updateDoc(scenarioRef, { dislikesCount: increment(1) });

    return { success: true, action: "added" };
  } catch (error) {
    console.error("Error disliking scenario:", error);
    return { success: false, error: error.message };
  }
};

/* =======================================================
   GET USER'S REACTION FOR A SCENARIO
======================================================= */
export const getUserReaction = async (scenarioId, userId) => {
  if (!scenarioId || !userId) {
    return null;
  }

  try {
    const reactionRef = doc(
      scenarioReactionsCollection,
      `${scenarioId}_${userId}`,
    );
    const reactionDoc = await getDoc(reactionRef);

    if (reactionDoc.exists()) {
      return reactionDoc.data().type; // "like" or "dislike" or null
    }

    return null;
  } catch (error) {
    console.error("Error getting user reaction:", error);
    return null;
  }
};

/* =======================================================
   GET ALL USER REACTIONS FOR MULTIPLE SCENARIOS
   Returns: { scenarioId1: "like", scenarioId2: "dislike", ... }
======================================================= */
export const getUserReactions = async (scenarioIds, userId) => {
  if (!scenarioIds || scenarioIds.length === 0 || !userId) {
    return {};
  }

  try {
    const reactions = {};

    // Fetch each reaction individually (more reliable than complex query)
    const promises = scenarioIds.map(async (scenarioId) => {
      const reactionRef = doc(
        scenarioReactionsCollection,
        `${scenarioId}_${userId}`,
      );
      const reactionDoc = await getDoc(reactionRef);

      if (reactionDoc.exists()) {
        reactions[scenarioId] = reactionDoc.data().type;
      }
    });

    await Promise.all(promises);
    return reactions;
  } catch (error) {
    console.error("Error getting user reactions:", error);
    return {};
  }
};
