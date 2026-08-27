import { UserCircle } from "lucide-react";
import { useAppStore } from "../../stores/useAppStore";

export function ProfilePage() {
  const profile = useAppStore((s) => s.profile);
  return (
    <div className="min-h-screen p-5 sm:p-8">
      <h1 className="text-3xl font-bold">Perfil</h1>
      <div className="mt-8 max-w-2xl rounded-3xl bg-white p-6 dark:bg-[#191b22]">
        {profile?.photoURL ? <img src={profile.photoURL} alt="" className="mb-4 h-16 w-16 rounded-full"/> : <UserCircle size={60} className="mb-4 text-primary"/>}
        <h2 className="text-xl font-semibold">{profile?.displayName ?? "Usuario demo"}</h2>
        <p className="text-sm opacity-60">{profile?.email ?? "demo@inknest.local"}</p>
        <p className="mt-4 text-xs opacity-40">Cuenta creada: {new Date(profile?.createdAt ?? Date.now()).toLocaleDateString("es-AR")}</p>
      </div>
    </div>
  );
}