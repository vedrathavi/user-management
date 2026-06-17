import UsersPage from "./pages/UsersPage";

function App() {
  return (
    <main className="relative min-h-screen w-full flex flex-col items-center bg-neutral-950 text-slate-100 overflow-x-hidden">

      {/* Main dashboard content container */}
      <div className="relative z-10 w-full px-4 py-8 md:px-8 md:py-12 flex flex-col gap-6">
        <UsersPage />
      </div>
    </main>
  );
}

export default App;
