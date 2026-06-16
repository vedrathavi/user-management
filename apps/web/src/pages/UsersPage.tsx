import { useCallback, useEffect, useState } from "react";
import type { User } from "@repo/types";
import UserTable from "../components/UserTable";
import UserForm from "../components/UserForm";
import type { UserFormData } from "../utils/userSchema";
import ConfirmDialog from "../components/ConfirmDialog";

import { type SearchUsersRequest } from "../utils/filters";
import {
  createUser,
  deleteUser,
  searchUsers,
  updateUser,
} from "../services/users.api";

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [total, setTotal] = useState<number>(0);
  const [filterOptions, setFilterOptions] = useState<Record<string, string[]>>({});
  const [tableQuery, setTableQuery] = useState<SearchUsersRequest>({
    page: 1,
    pageSize: 10,
    sort: undefined,
    filters: [],
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  const loadUsers = useCallback(async (query: SearchUsersRequest = tableQuery) => {
    try {
      setLoading(true);
      setError(null);

      const result = await searchUsers(query);
      setUsers(result.rows);
      setTotal(result.total);
      setFilterOptions(result.filterOptions);
    } catch {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [tableQuery]);

  useEffect(() => {
    async function init() {
      await loadUsers();
    }
    init();
  }, [loadUsers]);
  
  const handleSort = (field: string) => {
    setTableQuery((prev) => {
      const nextSort: { field: string; order: "ASC" | "DESC" } = !prev.sort || prev.sort.field !== field
        ? { field, order: "ASC" }
        : {
            field,
            order: prev.sort.order === "ASC" ? "DESC" : "ASC",
          };

      return {
        ...prev,
        page: 1,
        sort: nextSort,
      };
    });
  };

  const toggleFilter = (field: string, value: string) => {
    setTableQuery((prev) => {
      const currentFilters = prev.filters ?? [];
      const existing = currentFilters.find((filter) => filter.field === field);

      if (!existing) {
        return {
          ...prev,
          page: 1,
          filters: [
            ...currentFilters,
            {
              field,
              values: [value],
            },
          ],
        };
      }

      const alreadySelected = existing.values.includes(value);
      const values = alreadySelected
        ? existing.values.filter((currentValue) => currentValue !== value)
        : [...existing.values, value];

      if (values.length === 0) {
        return {
          ...prev,
          page: 1,
          filters: currentFilters.filter((filter) => filter.field !== field),
        };
      }

      return {
        ...prev,
        page: 1,
        filters: currentFilters.map((filter) =>
          filter.field === field
            ? {
                ...filter,
                values,
              }
            : filter,
        ),
      };
    });
  };

  const handleSelectAll = (field: string, allValues: string[]) => {
    setTableQuery((prev) => {
      const currentFilters = prev.filters ?? [];
      const rest = currentFilters.filter((filter) => filter.field !== field);
      return {
        ...prev,
        page: 1,
        filters: [
          ...rest,
          {
            field,
            values: allValues,
          },
        ],
      };
    });
  };

  const handleClearAll = (field: string) => {
    setTableQuery((prev) => ({
      ...prev,
      page: 1,
      filters: (prev.filters ?? []).filter((filter) => filter.field !== field),
    }));
  };

  

  // create handler - open form with empty fields
  const handleCreate = async (data: UserFormData) => {
    try {
      await createUser(data);
      await loadUsers();
      setIsFormOpen(false);
    } catch (err) {
      alert((err as Error).message || "Failed to create user");
    }
  };

  // open edit form with user data
  const openEditForm = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  // edit handler - row wise
  const handleEdit = async (data: UserFormData) => {
    if (!editingUser) return;
    try {
      await updateUser(editingUser.id, data);
      await loadUsers();
      setEditingUser(null);
      setIsFormOpen(false);
    } catch (err) {
      alert((err as Error).message || "Failed to update user");
    }
  };

  // delete handler - row wise
  const handleDelete = (id: string) => {
    setDeleteUserId(id);
  };

  // modal handlers
  const confirmDelete = async () => {
    if (!deleteUserId) return;
    try {
      await deleteUser(deleteUserId);
      await loadUsers();
      setDeleteUserId(null);
    } catch (err) {
      alert((err as Error).message || "Failed to delete user");
    }
  };

  const cancelDelete = () => {
    setDeleteUserId(null);
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
              {users.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold  text-neutral-200">
              {total}
            </span>{" "}
            users{" "}
          </p>
          {/* clear filters */}
          {(tableQuery.filters ?? []).length > 0 && (
            <button
              className=" text-neutral-500 hover:text-neutral-300 py-1 px-4"
              onClick={() => {
                setTableQuery((prev) => ({
                  ...prev,
                  page: 1,
                  filters: [],
                }));
              }}
            >
              Clear Filters
            </button>
          )}
        </div>

        <UserTable
          users={users}
          onSort={handleSort}
          sort={tableQuery.sort}
          filterOptions={filterOptions}
          selectedFilters={tableQuery.filters ?? []}
          onValueToggle={toggleFilter}
          onSelectAll={handleSelectAll}
          onClearAll={handleClearAll}
          onEdit={openEditForm}
          onDelete={handleDelete}
        />
      </div>

      <div className="flex gap-2 mt-4">
        <button
          disabled={tableQuery.page <= 1}
          onClick={
            () => {
              setTableQuery((prev) => ({
                ...prev,
                page: Math.max(prev.page - 1, 1),
              }));
            }
          }
        >
          Previous
        </button>
        <span className="mx-2">Page {tableQuery.page} of {Math.ceil(total / tableQuery.pageSize)}</span>

        <button
          disabled={tableQuery.page * tableQuery.pageSize >= total}
          onClick={
            () => {
              setTableQuery((prev) => ({
                ...prev,
                page: prev.page + 1,
              }));
            }
          }
        >
          Next
        </button>
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
};

export default UsersPage;
