import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  increment,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const commentsCollection = collection(db, "comments");
const commentLikesCollection = collection(db, "commentLikes");

export const getAllComments = async () => {
  const snapshot = await getDocs(commentsCollection);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};


export const createComment = async ({
  scenarioId,
  movieId = null,
  content,
  user,
  parentCommentId = null,
}) => {
  try {
    const commentData = {
      scenarioId,
      movieId,
      content,

      createdBy: user.uid,
      createdByName: user.name || "Anonymous",
      userPhotoURL: user.photoURL || "",

      parentCommentId,

      likesCount: 0,
      isEdited: false,

      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(commentsCollection, commentData);

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Create comment error:", error);
    return { success: false, error: error.message };
  }
};


export const getCommentsByScenario = async (scenarioId) => {
  const q = query(commentsCollection, where("scenarioId", "==", scenarioId));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};


export const subscribeToComments = (scenarioId, callback) => {
  const q = query(commentsCollection, where("scenarioId", "==", scenarioId));

  return onSnapshot(
    q,
    (snapshot) => {
      const comments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(comments);
    },
    (error) => {
      console.error("Comments listener error:", error);
    },
  );
};

export const updateComment = async (commentId, newContent) => {
  try {
    const commentRef = doc(db, "comments", commentId);

    await updateDoc(commentRef, {
      content: newContent,
      isEdited: true,
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error("Update comment error:", error);
    return { success: false, error: error.message };
  }
};


export const deleteComment = async (commentId) => {
  try {
    const commentRef = doc(db, "comments", commentId);
    await deleteDoc(commentRef);

    return { success: true };
  } catch (error) {
    console.error("Delete comment error:", error);
    return { success: false, error: error.message };
  }
};


export const likeComment = async (commentId, userId) => {
  try {
    const likeRef = doc(commentLikesCollection, `${commentId}_${userId}`);
    const commentRef = doc(db, "comments", commentId);

    await setDoc(likeRef, {
      commentId,
      userId,
      createdAt: serverTimestamp(),
    });

    await updateDoc(commentRef, {
      likesCount: increment(1),
    });

    return { success: true };
  } catch (error) {
    console.error("Like error:", error);
    return { success: false, error: error.message };
  }
};


export const unlikeComment = async (commentId, userId) => {
  try {
    const likeRef = doc(commentLikesCollection, `${commentId}_${userId}`);
    const commentRef = doc(db, "comments", commentId);

    await deleteDoc(likeRef);

    await updateDoc(commentRef, {
      likesCount: increment(-1),
    });

    return { success: true };
  } catch (error) {
    console.error("Unlike error:", error);
    return { success: false, error: error.message };
  }
};


export const hasUserLikedComment = async (commentId, userId) => {
  const likeRef = doc(commentLikesCollection, `${commentId}_${userId}`);
  const likeSnap = await getDoc(likeRef);
  return likeSnap.exists();
};
