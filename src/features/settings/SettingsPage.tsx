import { Moon, Sun } from "lucide-react";
import { useAppStore } from "../../stores/useAppStore";
import { Button } from "../../components/common/Button";

export function SettingsPage() {
  const dark = useAppStore((s) => s.darkMode);
  const toggle = useAppStore((s) => s.toggleTheme);
  return (
    <div className="min-h-screen p-5 sm:p-8">
      <h1 className="text-3xl font-bold">Configuración</h1>
      <div className="mt-8 max-w-2xl rounded-3xl bg-white p-6 dark:bg-[#191b22]">
        <h2 className="font-semibold">Apariencia</h2>
        <p className="mt-1 text-sm opacity-60">Elegí el aspecto de InkNest.</p>
        <Button className="mt-4" onClick={toggle}>{dark ? <Moon className="mr-2 inline" size={17}/> : <Sun className="mr-2 inline" size={17}/>} Cambiar tema</Button>
      </div>
    </div>
  );
}