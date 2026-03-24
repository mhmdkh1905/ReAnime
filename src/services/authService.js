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

export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );

  return userCredential.user;
};

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  //Google login flow is reasonable, but profile creation logic is embedded directly here. This is okay for a small project, but eventually user creation should be centralized to avoid drift from email registration.
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName || "",
      email: user.email,
      //Hardcoded avatar URLs are fine as defaults, but define them as shared constants instead of duplicating strings.
      photoURL: user.photoURL || "https://i.pravatar.cc/120?img=3",
      totalLikes: 0,
      totalPosterScenarios: 0,
      //`createdAt: new Date()` uses client time. In Firebase-backed apps, prefer `serverTimestamp()` for consistency.
      createdAt: new Date(),
      role: "user",
    });
  }

  return user;
};

export const registerUser = async (name, email, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  const user = userCredential.user;

  await updateProfile(user, {
    displayName: name,
  });

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    name: name,
    email: user.email,
    createdAt: new Date(),
    // This user shape uses `photoURL`, but other places in the project still refer to `profilePicture`. The team needs one consistent field name.
    role: "user",
    photoURL: "https://i.pravatar.cc/120?img=3",
    totalLikes: 0,
    totalPosterScenarios: 0,
  });

  return user;
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const observeAuthState = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const resetPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
};

export const getUserProfile = async (uid) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data();
  } else {
    return null;
    // `getUserProfile` returns `null` if missing; good. But this means callers must handle null carefully, and several components do not fully do that.
  }
};
