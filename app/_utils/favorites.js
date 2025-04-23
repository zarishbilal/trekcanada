import { db } from "./firebase";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
} from "firebase/firestore";

// Check if a trail is in the user's favorites
export async function isFavorite(uid, trailId) {
  if (!db || !uid) return false;
  const favRef = doc(db, "users", uid, "favorites", trailId.toString());
  const snap = await getDoc(favRef);
  return snap.exists();
}

// Add a trail to the user's favorites
export async function addFavorite(uid, trailId) {
  if (!db || !uid) return;
  const favRef = doc(db, "users", uid, "favorites", trailId.toString());
  await setDoc(favRef, { addedAt: Date.now() });
}

// Remove a trail from the user's favorites
export async function removeFavorite(uid, trailId) {
  if (!db || !uid) return;
  const favRef = doc(db, "users", uid, "favorites", trailId.toString());
  await deleteDoc(favRef);
}

// Retrieve all favorite trail IDs for a user
export async function getFavorites(uid) {
  if (!db || !uid) return [];
  const colRef = collection(db, "users", uid, "favorites");
  const snap = await getDocs(colRef);
  return snap.docs.map((d) => d.id);
}
