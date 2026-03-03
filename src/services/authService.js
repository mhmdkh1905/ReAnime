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

 
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName || "",
      email: user.email,
      photoURL: user.photoURL || "https://i.pravatar.cc/120?img=3",
      totalLikes: 0,
      totalPosterScenarios: 0,
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
  }
};
