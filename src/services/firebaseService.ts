import {
  addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp, setDoc
} from "firebase/firestore";
import { deleteObject, ref, uploadString } from "firebase/storage";
import { firestore, storage, isFirebaseConfigured } from "../config/firebase";
import type { Notebook, Page, UserProfile } from "../types/models";

const userRoot = (userId: string) => `users/${userId}`;

export const firebaseService = {
  async saveNotebook(userId: string, notebook: Notebook): Promise<void> {
    if (!isFirebaseConfigured || !firestore) return;
    await setDoc(doc(firestore, `${userRoot(userId)}/notebooks/${notebook.id}`), {
      ...notebook, serverUpdatedAt: serverTimestamp()
    });
  },
  async savePage(userId: string, page: Page): Promise<void> {
    if (!isFirebaseConfigured || !firestore) return;
    const pageRef = doc(firestore, `${userRoot(userId)}/notebooks/${page.notebookId}/pages/${page.id}`);
    await setDoc(pageRef, { ...page, serverUpdatedAt: serverTimestamp() });
  },
  async saveProfile(profile: UserProfile): Promise<void> {
    if (!isFirebaseConfigured || !firestore) return;
    await setDoc(doc(firestore, `${userRoot(profile.id)}`), profile, { merge: true });
  },
  async uploadImage(userId: string, pageId: string, dataUrl: string): Promise<string | undefined> {
    if (!isFirebaseConfigured || !storage) return undefined;
    const imageRef = ref(storage, `${userRoot(userId)}/images/${pageId}/${crypto.randomUUID()}.png`);
    await uploadString(imageRef, dataUrl, "data_url");
    return imageRef.fullPath;
  },
  async deleteImage(path: string): Promise<void> {
    if (!isFirebaseConfigured || !storage) return;
    await deleteObject(ref(storage, path));
  },
  async pullNotebooks(userId: string): Promise<Notebook[]> {
    if (!isFirebaseConfigured || !firestore) return [];
    const snapshot = await getDocs(collection(firestore, `${userRoot(userId)}/notebooks`));
    return snapshot.docs.map((item) => item.data() as Notebook);
  },
  async touch(_userId: string): Promise<void> {
    // Kept as a service boundary for future background sync metadata.
    void addDoc;
  }
};