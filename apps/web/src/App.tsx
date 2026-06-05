import type {User} from "@repo/types";
import { mockUsers } from "./data/mockUsers";
import UserTable from "./components/UserTable";
import { useState } from "react";

function App() {
  const [user, setUsers] = useState<User[]>(mockUsers);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  return (
    <main className="min-h-screen w-full flex flex-col justify-center items-center bg-neutral-950 px-6 py-12 text-slate-100">
      <span className="text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl">
        Users: {user.length}
      </span>
      <UserTable users={user} />
  
    </main>
  );
}

export default App;
