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

    // Get the scenario to find the creator
    const scenarioRef = doc(db, "scenarios", scenarioId);
    const scenarioDoc = await getDoc(scenarioRef);
    if (!scenarioDoc.exists()) {
      return { success: false, error: "Scenario not found" };
    }
    const scenarioData = scenarioDoc.data();
    const scenarioCreatorId = scenarioData.createdBy;

    if (existingReaction.exists()) {
      const currentData = existingReaction.data();

      // If already liked, remove the like (toggle off)
      if (currentData.type === "like") {
        await deleteDoc(likeRef);

        // Decrement likes count
        await updateDoc(scenarioRef, { likesCount: increment(-1) });

        // Decrement creator's totalLikes
        if (scenarioCreatorId && scenarioCreatorId !== userId) {
          const userRef = doc(db, "users", scenarioCreatorId);
          await updateDoc(userRef, { totalLikes: increment(-1) });
        }

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
        await updateDoc(scenarioRef, {
          likesCount: increment(1),
          dislikesCount: increment(-1),
        });

        // Net +1 for creator's totalLikes (like +1, dislike -1)
        if (scenarioCreatorId && scenarioCreatorId !== userId) {
          const userRef = doc(db, "users", scenarioCreatorId);
          await updateDoc(userRef, { totalLikes: increment(1) });
        }

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

    await updateDoc(scenarioRef, { likesCount: increment(1) });

    // Increment creator's totalLikes
    if (scenarioCreatorId && scenarioCreatorId !== userId) {
      const userRef = doc(db, "users", scenarioCreatorId);
      await updateDoc(userRef, { totalLikes: increment(1) });
    }

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

    // Get the scenario to find the creator
    const scenarioRef = doc(db, "scenarios", scenarioId);
    const scenarioDoc = await getDoc(scenarioRef);
    if (!scenarioDoc.exists()) {
      return { success: false, error: "Scenario not found" };
    }
    const scenarioData = scenarioDoc.data();
    const scenarioCreatorId = scenarioData.createdBy;

    if (existingReaction.exists()) {
      const currentData = existingReaction.data();

      // If already disliked, remove the dislike (toggle off)
      if (currentData.type === "dislike") {
        await deleteDoc(dislikeRef);

        // Decrement dislikes count
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
        await updateDoc(scenarioRef, {
          likesCount: increment(-1),
          dislikesCount: increment(1),
        });

        // Decrement creator's totalLikes (net -1)
        if (scenarioCreatorId && scenarioCreatorId !== userId) {
          const userRef = doc(db, "users", scenarioCreatorId);
          await updateDoc(userRef, { totalLikes: increment(-1) });
        }

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

export const increaseScenarioComentCount = async (scenarioId) => {
  try {
    const scenarioRef = doc(db, "scenarios", scenarioId);
    await updateDoc(scenarioRef, { commentsCount: increment(1) });
    return { success: true };
  } catch (error) {
    console.error("Error increasing comment count:", error);
    return { success: false, error: error.message };
  }
};

export const decreaseScenarioComentCount = async (scenarioId) => {
  try {
    const scenarioRef = doc(db, "scenarios", scenarioId);
    await updateDoc(scenarioRef, { commentsCount: increment(-1) });
    return { success: true };
  } catch (error) {
    console.error("Error decreasing comment count:", error);
    return { success: false, error: error.message };
  }
};
