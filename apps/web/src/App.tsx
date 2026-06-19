import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import UsersPage from "./pages/UsersPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

const AppContent = () => {
  const { isAuthenticated, loading, user, logout } = useAuth();

  if (loading) {
    return (
      <main className="min-h-screen w-full flex flex-col items-center justify-center bg-neutral-950 text-slate-100 gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
        <span className="text-sm font-medium text-neutral-400">Verifying session...</span>
      </main>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
        }
      />
      <Route
        path="/signup"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />
        }
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          !isAuthenticated ? (
            <Navigate to="/login" replace />
          ) : (
            <main className="relative min-h-screen w-full flex flex-col bg-neutral-950 text-slate-100 overflow-x-hidden">
              {/* Navbar */}
              <header className="sticky top-0 z-40 w-full border-b border-neutral-900 bg-neutral-950">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                  
                  {/* Logo / Brand */}
                  <span className="text-md font-bold tracking-tight text-neutral-100">
                    CoreDirectory
                  </span>

                  {/* User Profile and Logout */}
                  <div className="flex items-center gap-4">
                    {user && (
                      <span className="text-xs text-neutral-300">
                        {user.firstName} ({user.role})
                      </span>
                    )}

                    <button
                      onClick={logout}
                      className="border border-neutral-850 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-red-450 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>

                </div>
              </header>

              {/* Main dashboard content container */}
              <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex flex-col gap-6">
                <UsersPage />
              </div>
            </main>
          )
        }
      />

      {/* Redirect all other arbitrary routes to home / */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
