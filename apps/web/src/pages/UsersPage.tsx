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
import { useAuth } from "../context/AuthContext";

const UsersPage = () => {
  const { user: currentUser } = useAuth();
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

      const existingValues = existing.values ?? [];
      const alreadySelected = existingValues.includes(value);
      const values = alreadySelected
        ? existingValues.filter((currentValue) => currentValue !== value)
        : [...existingValues, value];

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

  const handleOperatorApply = (field: string, operator: string, value: string) => {
    setTableQuery((prev) => {
      const currentFilters = prev.filters ?? [];
      const rest = currentFilters.filter((filter) => {
        if (filter.field !== field) return true;
        if (operator === 'gte' || operator === 'lte') {
          return filter.operator !== operator;
        }
        return !filter.operator;
      });

      if (!value || value.trim() === '') {
        return {
          ...prev,
          page: 1,
          filters: rest,
        };
      }

      return {
        ...prev,
        page: 1,
        filters: [
          ...rest,
          {
            field,
            operator,
            value: value.trim(),
          },
        ],
      };
    });
  };

  const handleOperatorClear = (field: string, operator?: string) => {
    setTableQuery((prev) => {
      const currentFilters = prev.filters ?? [];
      const filters = currentFilters.filter((filter) => {
        if (filter.field !== field) return true;
        if (operator) {
          return filter.operator !== operator;
        }
        return !filter.operator;
      });
      return {
        ...prev,
        page: 1,
        filters,
      };
    });
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

  if (loading && users.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3 text-neutral-400">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
        <span className="text-sm font-medium">Loading user database...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[300px] h-full flex flex-col items-center justify-center gap-4 text-center rounded-xl border border-red-500/20 bg-red-500/5 p-8">
        <div>
          <h3 className="text-lg font-bold text-neutral-200">Error Loading Users</h3>
          <p className="text-sm text-neutral-400 mt-1">{error}</p>
        </div>
        <button
          onClick={() => loadUsers()}
          className="rounded-lg bg-neutral-800 px-4 py-2 text-xs font-semibold text-neutral-200 hover:bg-neutral-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-4 mx-auto">
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-200">
            User Directory
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Manage user accounts, roles, and status fields.
          </p>
        </div>
        {currentUser?.role === 'admin' && (
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg text-xs transition-colors cursor-pointer"
            onClick={() => {
              setEditingUser(null);
              setIsFormOpen(true);
            }}
          >
            Add User
          </button>
        )}
      </div>

      {/* Main Table Card */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 md:p-6 shadow-md flex flex-col gap-4">
        {/* Table Top Actions */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-200">
            Records Listed
          </h2>
          {/* clear filters */}
          {(tableQuery.filters ?? []).length > 0 && (
            <button
              className="text-xs text-neutral-400 hover:text-neutral-200 py-1.5 px-3 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
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

        {/* User Table container */}
        <div className="w-full">
          {loading ? (
            <div className="min-h-[200px] flex items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
            </div>
          ) : (
            <UserTable
              users={users}
              onSort={handleSort}
              sort={tableQuery.sort}
              filterOptions={filterOptions}
              selectedFilters={tableQuery.filters ?? []}
              onValueToggle={toggleFilter}
              onSelectAll={handleSelectAll}
              onClearAll={handleClearAll}
              onOperatorApply={handleOperatorApply}
              onOperatorClear={handleOperatorClear}
              onEdit={openEditForm}
              onDelete={handleDelete}
            />
          )}
        </div>

        {/* Pagination Block */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2 pt-4 border-t border-neutral-800 text-xs text-neutral-400">
          <div>
            Showing <span className="font-semibold text-neutral-200">{total === 0 ? 0 : (tableQuery.page - 1) * tableQuery.pageSize + 1}</span> to{" "}
            <span className="font-semibold text-neutral-200">{Math.min(tableQuery.page * tableQuery.pageSize, total)}</span> of{" "}
            <span className="font-semibold text-neutral-200">{total}</span> users
          </div>

          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-850 hover:bg-neutral-800 hover:text-neutral-200 disabled:opacity-40 disabled:hover:bg-neutral-950 disabled:hover:text-neutral-450 disabled:cursor-not-allowed transition-colors cursor-pointer text-xs font-medium"
              disabled={tableQuery.page <= 1}
              onClick={() => {
                setTableQuery((prev) => ({
                  ...prev,
                  page: Math.max(prev.page - 1, 1),
                }));
              }}
            >
              Prev
            </button>
            
            <span className="px-3 py-1.5 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-300 font-semibold text-[10px]">
              Page {tableQuery.page} of {Math.ceil(total / tableQuery.pageSize) || 1}
            </span>

            <button
              className="px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-850 hover:bg-neutral-800 hover:text-neutral-200 disabled:opacity-40 disabled:hover:bg-neutral-950 disabled:hover:text-neutral-450 disabled:cursor-not-allowed transition-colors cursor-pointer text-xs font-medium"
              disabled={tableQuery.page * tableQuery.pageSize >= total}
              onClick={() => {
                setTableQuery((prev) => ({
                  ...prev,
                  page: prev.page + 1,
                }));
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modals / Dialogs */}
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
