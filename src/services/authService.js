import { auth, db } from "../firebase/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";

import { doc, setDoc, getDoc } from "firebase/firestore";

//Email login
export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );

  return userCredential.user;
};

// Google Login
export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  // If user does not exist in Firestore, create it
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName || "",
      email: user.email,
      photoURL: user.photoURL || "",
      createdAt: new Date(),
      role: "user",
    });
  }

  return user;
};

//Register user
export const registerUser = async (name, email, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  const user = userCredential.user;

  // Update displayName in Firebase Auth
  await updateProfile(user, {
    displayName: name,
  });

  // Create Firestore user document
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    name: name,
    email: user.email,
    createdAt: new Date(),
    role: "user",
    photoURL: "",
  });

  return user;
};

// Logout
export const logoutUser = async () => {
  await signOut(auth);
};

// Observe Auth State
export const observeAuthState = (callback) => {
  return onAuthStateChanged(auth, callback);
};

//Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

export const resetPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
};
