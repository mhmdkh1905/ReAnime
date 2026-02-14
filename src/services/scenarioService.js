import { db } from "../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

const scenarioCollection = collection(db, "scenarios");

// CREATE
export const createScenario = async (data) => {
  return await addDoc(scenarioCollection, data);
};

// READ ALL
export const getAllScenarios = async () => {
  const snapshot = await getDocs(scenarioCollection);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// READ BY ANIME
export const getScenariosByAnime = async (animeId) => {
  const q = query(scenarioCollection, where("animeId", "==", animeId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// UPDATE
export const updateScenario = async (id, updatedData) => {
  const docRef = doc(db, "scenarios", id);
  return await updateDoc(docRef, updatedData);
};

// DELETE
export const deleteScenario = async (id) => {
  const docRef = doc(db, "scenarios", id);
  return await deleteDoc(docRef);
};
