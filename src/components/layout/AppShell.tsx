import { useEffect, type ReactNode } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { BookOpen, Folder, Home, Moon, Settings, Sun, Trash2, UserCircle, Search } from "lucide-react";
import { useAppStore } from "../../stores/useAppStore";
import { useOnline } from "../../hooks/useOnline";

export function AppShell({ children }: { children?: ReactNode }) {
  const darkMode = useAppStore((s) => s.darkMode);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const online = useOnline();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const links = [
    ["/app", "Todos", Home],
    ["/app?recent=1", "Recientes", BookOpen],
    ["/app?favorites=1", "Favoritos", BookOpen],
    ["/app?folders=1", "Carpetas", Folder],
    ["/app/trash", "Papelera", Trash2],
    ["/app/settings", "Configuración", Settings],
    ["/app/profile", "Perfil", UserCircle]
  ] as const;

  return (
    <div className="min-h-screen bg-paper text-ink dark:bg-[#111318] dark:text-[#E4E1E9]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-black/5 bg-white/80 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#15171d]/90 md:block">
        <button onClick={() => navigate("/app")} className="mb-8 flex items-center gap-3 px-2 text-left">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-xl text-white">✒</div>
          <div><div className="font-bold">InkNest</div><div className="text-xs opacity-60">Notas que toman forma</div></div>
        </button>
        <nav className="space-y-1">
          {links.map(([to, label, Icon]) => (
            <NavLink key={label} to={to} className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${isActive ? "bg-primary/10 text-primary dark:bg-primary/20" : "opacity-75 hover:bg-black/5 dark:hover:bg-white/5"}`
            }>
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <button onClick={() => navigate("/app")} className="mb-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm opacity-70 hover:bg-black/5 dark:hover:bg-white/5">
            <Search size={18}/> Buscar cuadernos
          </button>
          <button onClick={toggleTheme} className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5">
            <span className="flex items-center gap-2">{darkMode ? <Moon size={18}/> : <Sun size={18}/>} {darkMode ? "Modo oscuro" : "Modo claro"}</span>
            <span className="text-xs">{online ? "● online" : "○ offline"}</span>
          </button>
        </div>
      </aside>
      <main className="md:pl-64">{children ?? <Outlet />}</main>
    </div>
  );
}