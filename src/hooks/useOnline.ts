import { useEffect } from "react";
import { useAppStore } from "../stores/useAppStore";

export function useOnline(): boolean {
  const online = useAppStore((state) => state.online);
  useEffect(() => {
    const on = () => useAppStore.getState().setOnline(true);
    const off = () => useAppStore.getState().setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);
  return online;
}