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
 * InkNest reads Firebase from Vite environment variables. The checked-in
 * .env.example contains placeholders; a local .env may contain a project's
 * public Web SDK configuration.
 */
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
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
