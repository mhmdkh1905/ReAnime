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

const usersCollection = collection(db, "users");

export const createUser = async (userData) => {
  try {
    if (!userData.name) {
      throw new Error("Name is required");
    }
    if (!userData.email) {
      throw new Error("Email is required");
    }
    //This is the most important issue in this file: users should almost certainly use the auth UID as the Firestore document id, not an auto-generated id.
    const docRef = await addDoc(usersCollection, {
      name: userData.name,
      email: userData.email,
      profilePicture: userData.profilePicture || "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const q = query(usersCollection, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return users;
  } catch (error) {
    console.error("Error getting users:", error);
    throw error;
  }
};

export const updateUser = async (userId, updatedData) => {
  try {
    const userRef = doc(db, "users", userId);

    await updateDoc(userRef, {
      ...updatedData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    await deleteDoc(userRef);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
