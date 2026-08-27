import { signOut } from "firebase/auth";
import { auth, isFirebaseConfigured } from "../../config/firebase";

export async function logout(): Promise<void> {
  if (isFirebaseConfigured && auth) await signOut(auth);
}