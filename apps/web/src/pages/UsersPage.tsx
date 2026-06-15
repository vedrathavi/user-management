import React from 'react'
import type { User } from "@repo/types";
import { mockUsers } from "../data/mockUsers";
import UserTable from "../components/UserTable";
import { useState } from "react";
import UserForm from '../components/UserForm';
import type { UserFormData } from '../utils/userSchema';
import ConfirmDialog from '../components/ConfirmDialog';
import { applyFilters } from '../utils/filters';
import type { UserFilters } from '../utils/filters';

const UsersPage = () => {
  
    const [user, setUsers] = useState<User[]>(mockUsers);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  const [filters, setFilters] = useState<UserFilters>({});

  const filteredUsers = applyFilters(user, filters);


  // create handler - open form with empty fields 
    const handleCreate = (data: UserFormData) => {
        const newUser: User = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
        setUsers((prev) => [...prev, newUser]);
        setIsFormOpen(false);
    };
    // open edit form with user data
    const openEditForm = (user: User) => { setEditingUser(user); setIsFormOpen(true); };
    
    // edit handler - row wise
    const handleEdit = (data: UserFormData) => {
        if (!editingUser) return;
        setIsFormOpen(true);
        const updatedUser: User = { ...editingUser, ...data };
        setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
        setEditingUser(null);
        setIsFormOpen(false);
    };

    // delete handler - row wise
    const handleDelete = (id: string) => {
        setDeleteUserId(id);
        
    };

    // modal handlers
    const confirmDelete = () => { 
        if (!deleteUserId) return;

        setUsers((prev) => prev.filter((u) => u.id !== deleteUserId));

        setDeleteUserId(null);
    }
    const cancelDelete = () => {
      setDeleteUserId(null);
    };

  return (
    <div className="w-full flex flex-col gap-1 mx-auto">
      <div>
        <div className="w-full flex justify-between mb-4">
          {/* Add User Button */}
          <button
            className="bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-semibold py-2 px-4 rounded"
            onClick={() => {
              setEditingUser(null);
              setIsFormOpen(true);
            }}
          >
            Add User
          </button>
        </div>
        {/* User Table */}
        <div className="w-full flex justify-between items-center">
          <p className="mb-1 italic text-neutral-300">
            {" "}
            Showing{" "}
            <span className="font-semibold text-neutral-200">
              {filteredUsers.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold  text-neutral-200">
              {user.length}
            </span>{" "}
            users{" "}
          </p>
          {/* clear filters */}
          {(filters.firstName ||
            filters.lastName ||
            filters.email ||
            filters.role ||
            filters.status ||
            filters.department ||
            filters.phone ||
            filters.createdFrom) && (
            <button
              className=" text-neutral-500 hover:text-neutral-300 py-1 px-4"
              onClick={() => setFilters({})}
            >
              Clear Filters
            </button>
          )}
        </div>

        <UserTable
          users={filteredUsers}
          filters={filters}
          onFilterChange={setFilters}
          onEdit={openEditForm}
          onDelete={handleDelete}
        />
      </div>

      <div>
        {isFormOpen && (
          <UserForm
            user={editingUser}
            onSubmit={editingUser ? handleEdit : handleCreate}
            onClose={() => {
              setIsFormOpen(false);
              setEditingUser(null);
            }}
          />
        )}
        {deleteUserId && (
          <ConfirmDialog
            title="Confirm Deletion"
            message="Are you sure you want to delete this user? This action cannot be undone."
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        )}
      </div>
    </div>
  );
}

export default UsersPage
