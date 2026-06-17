import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import UsersPage from "./pages/UsersPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { LogOut, Database, User as UserIcon } from "lucide-react";

const AppContent = () => {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const [view, setView] = useState<"login" | "register">("login");

  if (loading) {
    return (
      <main className="min-h-screen w-full flex flex-col items-center justify-center bg-neutral-950 text-slate-100 gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
        <span className="text-sm font-medium text-neutral-400">Verifying session...</span>
      </main>
    );
  }

  if (!isAuthenticated) {
    return view === "login" ? (
      <LoginPage onToggleView={() => setView("register")} />
    ) : (
      <RegisterPage onToggleView={() => setView("login")} />
    );
  }

  // Render role badge helper
  const renderHeaderRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <span className="inline-flex items-center rounded-md bg-purple-500/10 px-2 py-0.5 text-xs font-semibold text-purple-400 border border-purple-500/20">
            Admin
          </span>
        );
      case "editor":
        return (
          <span className="inline-flex items-center rounded-md bg-blue-500/10 px-2 py-0.5 text-xs font-semibold text-blue-400 border border-blue-500/20">
            Editor
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-md bg-neutral-500/10 px-2 py-0.5 text-xs font-semibold text-neutral-400 border border-neutral-800">
            Viewer
          </span>
        );
    }
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col bg-neutral-950 text-slate-100 overflow-x-hidden">
      {/* Glow overlays */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Glassmorphic Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-indigo-600/15 p-2 text-indigo-400 border border-indigo-500/10">
              <Database size={18} />
            </div>
            <span className="text-md font-bold tracking-tight bg-gradient-to-r from-neutral-100 to-neutral-400 bg-clip-text text-transparent">
              CoreDirectory
            </span>
          </div>

          {/* User Profile and Logout */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-neutral-900 bg-neutral-900/40">
                <div className="rounded-full bg-neutral-800 p-1 text-neutral-400">
                  <UserIcon size={14} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold text-neutral-200 leading-tight">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-[10px] text-neutral-400 leading-tight truncate max-w-[120px]">
                    {user.email}
                  </span>
                </div>
                {renderHeaderRoleBadge(user.role)}
              </div>
            )}

            <button
              onClick={logout}
              title="Log Out"
              className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/20 hover:bg-red-950/10 hover:border-red-900/20 hover:text-red-400 text-neutral-400 px-3.5 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer"
            >
              <LogOut size={14} />
              <span className="hidden xs:inline">Sign Out</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main dashboard content container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex flex-col gap-6">
        <UsersPage />
      </div>
    </main>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
