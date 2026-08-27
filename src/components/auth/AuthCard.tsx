import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "../common/Button";
import { isFirebaseConfigured, auth, googleProvider } from "../../config/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

export function AuthCard({ mode }: { mode: "login" | "register" | "forgot" }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");

  const submit = async () => {
    if (!email || (mode !== "forgot" && password.length < 6)) {
      setMessage("Completá los datos. La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (!isFirebaseConfigured || !auth) {
      setMessage("Modo demo: autenticación simulada. Entrando a InkNest…");
      setTimeout(() => navigate("/app"), 350);
      return;
    }
    try {
      if (mode === "login") await signInWithEmailAndPassword(auth, email, password);
      else if (mode === "register") {
        const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth");
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(credential.user, { displayName: name || email.split("@")[0] });
      } else {
        const { sendPasswordResetEmail } = await import("firebase/auth");
        await sendPasswordResetEmail(auth, email);
        setMessage("Te enviamos un correo para recuperar tu contraseña.");
        return;
      }
      navigate("/app");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo completar la operación.");
    }
  };

  const google = async () => {
    if (!isFirebaseConfigured || !auth) {
      setMessage("Modo demo: Google Login simulado.");
      setTimeout(() => navigate("/app"), 350);
      return;
    }
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/app");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo iniciar con Google.");
    }
  };

  const title = mode === "login" ? "Bienvenido de nuevo" : mode === "register" ? "Crear tu InkNest" : "Recuperar acceso";

  return (
    <div className="w-full max-w-md rounded-[2rem] border border-black/5 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-[#191b22]">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary text-2xl text-white">✒</div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-2 text-sm opacity-60">{isFirebaseConfigured ? "Conectado a Firebase" : "Modo demo local activo"}</p>
      </div>
      {mode === "register" && <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre" className="mb-3 w-full rounded-xl border bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30" />}
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo electrónico" className="mb-3 w-full rounded-xl border bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30" />
      {mode !== "forgot" && <div className="relative mb-4">
        <input type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" className="w-full rounded-xl border bg-transparent px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-primary/30" />
        <button aria-label="Mostrar contraseña" onClick={() => setShow(!show)} className="absolute right-3 top-3.5 opacity-60">{show ? <EyeOff size={20}/> : <Eye size={20}/>}</button>
      </div>}
      <Button variant="primary" className="w-full" onClick={submit}><LogIn className="mr-2 inline" size={18}/>{mode === "forgot" ? "Enviar recuperación" : mode === "register" ? "Crear cuenta" : "Iniciar sesión"}</Button>
      {mode !== "forgot" && <Button className="mt-3 w-full border" onClick={google}>Continuar con Google</Button>}
      {message && <p className="mt-4 rounded-xl bg-primary/10 p-3 text-sm">{message}</p>}
      <div className="mt-6 flex justify-between text-sm text-primary">
        <Link to={mode === "login" ? "/register" : "/login"}>{mode === "login" ? "Crear cuenta" : "Iniciar sesión"}</Link>
        <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
      </div>
    </div>
  );
}