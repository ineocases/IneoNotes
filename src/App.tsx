import { useEffect, useState } from "react";
import { HashRouter } from "react-router-dom";
import { AppRoutes } from "./app/Routes";
import { useAppStore } from "./stores/useAppStore";
import { isFirebaseConfigured, auth, connectToEmulators } from "./config/firebase";
import { seedDemo } from "./database/seedDemo";
import { onAuthStateChanged } from "firebase/auth";
import { flushSyncQueue } from "./services/syncService";
import { firebaseService } from "./services/firebaseService";

export default function App() {
  const loadLocal = useAppStore((s) => s.loadLocal);
  const setProfile = useAppStore((s) => s.setProfile);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    connectToEmulators();

    void (async () => {
      await seedDemo();
      await loadLocal();
      if (!active) return;
      setReady(true);
    })();

    if (isFirebaseConfigured && auth) {
      return onAuthStateChanged(auth, (user) => {
        setProfile(user ? {
          id: user.uid,
          email: user.email ?? "",
          displayName: user.displayName ?? user.email?.split("@")[0] ?? "Usuario",
          photoURL: user.photoURL ?? undefined,
          createdAt: user.metadata.creationTime ? Date.parse(user.metadata.creationTime) : Date.now()
        } : null);
        if (user) {
          void firebaseService.saveProfile({
            id: user.uid,
            email: user.email ?? "",
            displayName: user.displayName ?? user.email?.split("@")[0] ?? "Usuario",
            photoURL: user.photoURL ?? undefined,
            createdAt: user.metadata.creationTime ? Date.parse(user.metadata.creationTime) : Date.now()
          });
          void flushSyncQueue(user.uid);
        }
      });
    }

    setProfile({ id: "demo-user", email: "demo@inknest.local", displayName: "Usuario demo", createdAt: Date.now() });
    return () => { active = false; };
  }, [loadLocal, setProfile]);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) return;
    const handleOnline = () => {
      const user = auth?.currentUser;
      if (user) void flushSyncQueue(user.uid);
    };
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, []);

  if (!ready) {
    return <div className="grid min-h-screen place-items-center bg-paper dark:bg-[#111318]"><div className="rounded-2xl bg-white px-6 py-4 text-sm shadow-lg dark:bg-[#191b22]">Cargando InkNest…</div></div>;
  }

  return <HashRouter><AppRoutes /></HashRouter>;
}
