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


export const likeScenario = async (scenarioId, userId) => {
  if (!scenarioId || !userId) {
    return { success: false, error: "Missing required fields" };
  }

  try {
    const likeRef = doc(scenarioReactionsCollection, `${scenarioId}_${userId}`);
    const existingReaction = await getDoc(likeRef);

   
    const scenarioRef = doc(db, "scenarios", scenarioId);
    const scenarioDoc = await getDoc(scenarioRef);
    if (!scenarioDoc.exists()) {
      return { success: false, error: "Scenario not found" };
    }
    const scenarioData = scenarioDoc.data();
    const scenarioCreatorId = scenarioData.createdBy;

    if (existingReaction.exists()) {
      const currentData = existingReaction.data();

      
      if (currentData.type === "like") {
        await deleteDoc(likeRef);

        
        await updateDoc(scenarioRef, { likesCount: increment(-1) });

        
        if (scenarioCreatorId && scenarioCreatorId !== userId) {
          const userRef = doc(db, "users", scenarioCreatorId);
          await updateDoc(userRef, { totalLikes: increment(-1) });
        }

        return { success: true, action: "removed" };
      }

      
      if (currentData.type === "dislike") {
        await setDoc(likeRef, {
          scenarioId,
          userId,
          type: "like",
          createdAt: serverTimestamp(),
        });

       
        await updateDoc(scenarioRef, {
          likesCount: increment(1),
          dislikesCount: increment(-1),
        });

       
        if (scenarioCreatorId && scenarioCreatorId !== userId) {
          const userRef = doc(db, "users", scenarioCreatorId);
          await updateDoc(userRef, { totalLikes: increment(1) });
        }

        return { success: true, action: "changed_to_like" };
      }
    }

   
    await setDoc(likeRef, {
      scenarioId,
      userId,
      type: "like",
      createdAt: serverTimestamp(),
    });

    await updateDoc(scenarioRef, { likesCount: increment(1) });

    
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

 
    const scenarioRef = doc(db, "scenarios", scenarioId);
    const scenarioDoc = await getDoc(scenarioRef);
    if (!scenarioDoc.exists()) {
      return { success: false, error: "Scenario not found" };
    }
    const scenarioData = scenarioDoc.data();
    const scenarioCreatorId = scenarioData.createdBy;

    if (existingReaction.exists()) {
      const currentData = existingReaction.data();

    
      if (currentData.type === "dislike") {
        await deleteDoc(dislikeRef);

       
        await updateDoc(scenarioRef, { dislikesCount: increment(-1) });

        return { success: true, action: "removed" };
      }

      
      if (currentData.type === "like") {
        await setDoc(dislikeRef, {
          scenarioId,
          userId,
          type: "dislike",
          createdAt: serverTimestamp(),
        });

       
        await updateDoc(scenarioRef, {
          likesCount: increment(-1),
          dislikesCount: increment(1),
        });

       
        if (scenarioCreatorId && scenarioCreatorId !== userId) {
          const userRef = doc(db, "users", scenarioCreatorId);
          await updateDoc(userRef, { totalLikes: increment(-1) });
        }

        return { success: true, action: "changed_to_dislike" };
      }
    }

    
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
      return reactionDoc.data().type; 
    }

    return null;
  } catch (error) {
    console.error("Error getting user reaction:", error);
    return null;
  }
};


export const getUserReactions = async (scenarioIds, userId) => {
  if (!scenarioIds || scenarioIds.length === 0 || !userId) {
    return {};
  }

  try {
    const reactions = {};

    
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
