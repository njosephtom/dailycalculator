import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app, auth, db, googleProvider;
export const firebaseConfigMissing = !firebaseConfig.apiKey;

if (!firebaseConfigMissing) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  // IndexedDB cache: revisits render from local data while the server catches up
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
  });
  googleProvider = new GoogleAuthProvider();
} else {
  // ponytail: mock objects for missing config - prevents crash, shows setup screen
  auth = { currentUser: null };
  db = null;
  googleProvider = null;
}

export { auth, db, googleProvider };
export default app;
