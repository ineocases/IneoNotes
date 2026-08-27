import { useEffect } from "react";
import { HashRouter } from "react-router-dom";
import { AppRoutes } from "./app/Routes";
import { useAppStore } from "./stores/useAppStore";
import { isFirebaseConfigured, auth } from "./config/firebase";
import { seedDemo } from "./database/seedDemo";
import { onAuthStateChanged } from "firebase/auth";

export default function App() {
  const loadLocal = useAppStore((s) => s.loadLocal);
  const setProfile = useAppStore((s) => s.setProfile);

  useEffect(() => {
    void (async () => { await seedDemo(); await loadLocal(); })();
    if (isFirebaseConfigured && auth) {
      return onAuthStateChanged(auth, (user) => {
        setProfile(user ? {
          id: user.uid,
          email: user.email ?? "",
          displayName: user.displayName ?? user.email?.split("@")[0] ?? "Usuario",
          photoURL: user.photoURL ?? undefined,
          createdAt: user.metadata.creationTime ? Date.parse(user.metadata.creationTime) : Date.now()
        } : null);
      });
    }
    setProfile({ id: "demo-user", email: "demo@inknest.local", displayName: "Usuario demo", createdAt: Date.now() });
  }, [loadLocal, setProfile]);

  return <HashRouter><AppRoutes /></HashRouter>;
}