import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  increment,
  onSnapshot,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const commentsCollection = collection(db, "comments");
const commentLikesCollection = collection(db, "commentLikes");

/* =======================================================
   CREATE COMMENT
======================================================= */
export const createComment = async ({
  scenarioId,
  movieId,
  content,
  user,
  parentCommentId = null,
}) => {
  try {
    if (!scenarioId || !content || !user?.uid) {
      throw new Error("Missing required fields");
    }

    const commentData = {
      scenarioId,
      movieId,
      content,

      createdBy: user.uid,
      createdByName: user.name || "Anonymous",
      userPhotoURL: user.photoURL || "",

      parentCommentId, // null = normal comment | id = reply

      likesCount: 0,
      isEdited: false,

      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(commentsCollection, commentData);

    // increment comments count in scenario
    const scenarioRef = doc(db, "scenarios", scenarioId);
    await updateDoc(scenarioRef, {
      commentsCount: increment(1),
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/* =======================================================
   GET COMMENTS BY SCENARIO (One Time Fetch)
======================================================= */
export const getCommentsByScenario = async (scenarioId) => {
  const q = query(
    commentsCollection,
    where("scenarioId", "==", scenarioId),
    orderBy("createdAt", "asc"),
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

/* =======================================================
   REAL-TIME COMMENTS LISTENER
======================================================= */
export const subscribeToComments = (scenarioId, callback) => {
  const q = query(
    commentsCollection,
    where("scenarioId", "==", scenarioId),
    orderBy("createdAt", "asc"),
  );

  return onSnapshot(q, (snapshot) => {
    const comments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(comments);
  });
};

/* =======================================================
   UPDATE COMMENT
======================================================= */
export const updateComment = async (commentId, newContent) => {
  const commentRef = doc(db, "comments", commentId);

  await updateDoc(commentRef, {
    content: newContent,
    isEdited: true,
    updatedAt: serverTimestamp(),
  });
};

/* =======================================================
   DELETE COMMENT
======================================================= */
export const deleteComment = async (commentId, scenarioId) => {
  const commentRef = doc(db, "comments", commentId);

  await deleteDoc(commentRef);

  // decrement scenario comments count
  const scenarioRef = doc(db, "scenarios", scenarioId);
  await updateDoc(scenarioRef, {
    commentsCount: increment(-1),
  });
};

/* =======================================================
   LIKE COMMENT
======================================================= */
export const likeComment = async (commentId, userId) => {
  const likeRef = doc(commentLikesCollection, `${commentId}_${userId}`);

  const existingLike = await getDoc(likeRef);

  if (!existingLike.exists()) {
    await setDoc(likeRef, {
      commentId,
      userId,
      createdAt: serverTimestamp(),
    });

    const commentRef = doc(db, "comments", commentId);
    await updateDoc(commentRef, {
      likesCount: increment(1),
    });
  }
};

/* =======================================================
   UNLIKE COMMENT
======================================================= */
export const unlikeComment = async (commentId, userId) => {
  const likeRef = doc(commentLikesCollection, `${commentId}_${userId}`);

  const existingLike = await getDoc(likeRef);

  if (existingLike.exists()) {
    await deleteDoc(likeRef);

    const commentRef = doc(db, "comments", commentId);
    await updateDoc(commentRef, {
      likesCount: increment(-1),
    });
  }
};
