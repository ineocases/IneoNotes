import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { AuthCard } from "../components/auth/AuthCard";
import { LibraryPage } from "../features/notebooks/LibraryPage";
import { NotebookEditorPage } from "../features/editor/NotebookEditorPage";
import { TrashPage } from "../features/trash/TrashPage";
import { SettingsPage } from "../features/settings/SettingsPage";
import { ProfilePage } from "../features/settings/ProfilePage";

function Auth({ mode }: { mode: "login" | "register" | "forgot" }) {
  return <div className="grid min-h-screen place-items-center bg-paper p-4 dark:bg-[#111318]"><AuthCard mode={mode}/></div>;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/app" replace />} />
      <Route path="/login" element={<Auth mode="login" />} />
      <Route path="/register" element={<Auth mode="register" />} />
      <Route path="/forgot-password" element={<Auth mode="forgot" />} />
      <Route element={<AppShell />}>
        <Route path="/app" element={<LibraryPage />} />
        <Route path="/app/notebooks/:notebookId" element={<NotebookEditorPage />} />
        <Route path="/app/notebooks/:notebookId/pages/:pageId" element={<NotebookEditorPage />} />
        <Route path="/app/trash" element={<TrashPage />} />
        <Route path="/app/settings" element={<SettingsPage />} />
        <Route path="/app/profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/app" replace />} />
    </Routes>
  );
}