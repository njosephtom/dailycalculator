import { doc, setDoc, increment } from "firebase/firestore";
import { db } from "./firebase";

export async function recordUsage(userId, calculatorId) {
  if (!userId || !calculatorId) return;
  try {
    const docRef = doc(db, "users", userId, "usage", calculatorId);
    await setDoc(docRef, { count: increment(1), lastUsed: new Date() }, { merge: true });
  } catch (err) {
    console.error("Error recording usage:", err);
  }
}
