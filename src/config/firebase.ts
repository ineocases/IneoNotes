import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  type Auth,
  connectAuthEmulator,
} from "firebase/auth";
import {
  getFirestore,
  type Firestore,
  connectFirestoreEmulator,
} from "firebase/firestore";
import {
  getStorage,
  type FirebaseStorage,
  connectStorageEmulator,
} from "firebase/storage";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

const env = import.meta.env;

/**
 * Firebase Web SDK configuration is client-side configuration, not a server
 * secret. InkNest prefers Vite environment variables, but includes the
 * provided project's public Web SDK values as a fallback so a GitHub Pages
 * build also works when repository Actions secrets have not been created yet.
 */
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyBilkb1oLOaFwiM3LnYU3njrKLNjZWggp8",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "ineonotees.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "ineonotees",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "ineonotees.firebasestorage.app",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "22532007738",
  appId: env.VITE_FIREBASE_APP_ID || "1:22532007738:web:9297e6ff345c4151675203",
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || "G-B31KHX33SG",
};

export const isFirebaseConfigured = Object.values(firebaseConfig)
  .slice(0, 6)
  .every((value) => Boolean(value) && value !== "CAMBIAR_AQUI");

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let firestore: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let analytics: Analytics | null = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  firestore = getFirestore(app);
  storage = getStorage(app);

  // Analytics is optional and must not prevent InkNest from starting on
  // browsers where Firebase Analytics is unsupported (e.g. some privacy modes).
  void isSupported().then((supported) => {
    if (supported && app) analytics = getAnalytics(app);
  });
}

export { app, auth, firestore, storage, analytics };
export const googleProvider = new GoogleAuthProvider();

let emulatorsConnected = false;

export function connectToEmulators(): void {
  if (emulatorsConnected || !isFirebaseConfigured || !auth || !firestore || !storage) return;
  if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATORS === "true") {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
    connectFirestoreEmulator(firestore, "127.0.0.1", 8080);
    connectStorageEmulator(storage, "127.0.0.1", 9199);
    emulatorsConnected = true;
  }
}
