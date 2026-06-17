import { useCallback, useEffect, useState } from "react";
import type { User } from "@repo/types";
import UserTable from "../components/UserTable";
import UserForm from "../components/UserForm";
import type { UserFormData } from "../utils/userSchema";
import ConfirmDialog from "../components/ConfirmDialog";
import { Plus, ChevronLeft, ChevronRight, Users, CheckCircle, AlertCircle, Sparkles, FilterX } from "lucide-react";

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
      <div className="min-h-[300px] h-full flex flex-col items-center justify-center gap-4 text-center rounded-2xl border border-red-500/20 bg-red-500/5 p-8">
        <AlertCircle className="text-red-500 h-10 w-10" />
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
    <div className="w-full h-full flex flex-col gap-6 mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-200">
            User Directory
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Manage system directories, user accounts, and credentials.
          </p>
        </div>
        <button
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-indigo-500/15 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
          onClick={() => {
            setEditingUser(null);
            setIsFormOpen(true);
          }}
        >
          <Plus size={16} />
          <span>Add User</span>
        </button>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex items-center gap-4 rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4 backdrop-blur-sm">
          <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
            <Users size={20} />
          </div>
          <div>
            <p className="text-xs text-neutral-400 font-medium">Total Matches</p>
            <h3 className="text-xl font-bold text-neutral-100">{total}</h3>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4 backdrop-blur-sm">
          <div className="rounded-xl bg-green-500/10 p-3 text-green-400">
            <CheckCircle size={20} />
          </div>
          <div>
            <p className="text-xs text-neutral-400 font-medium">Active (Page)</p>
            <h3 className="text-xl font-bold text-neutral-100">
              {users.filter((u) => u.status === "active").length}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4 backdrop-blur-sm">
          <div className="rounded-xl bg-red-500/10 p-3 text-red-400">
            <AlertCircle size={20} />
          </div>
          <div>
            <p className="text-xs text-neutral-400 font-medium">Inactive (Page)</p>
            <h3 className="text-xl font-bold text-neutral-100">
              {users.filter((u) => u.status === "inactive").length}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4 backdrop-blur-sm">
          <div className="rounded-xl bg-purple-500/10 p-3 text-purple-400">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="text-xs text-neutral-400 font-medium">Active Filters</p>
            <h3 className="text-xl font-bold text-neutral-100">{(tableQuery.filters ?? []).length}</h3>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/10 backdrop-blur-sm p-4 md:p-6 shadow-xl flex flex-col gap-4">
        {/* Table Top Actions */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-200">
            Records Listed
          </h2>
          {/* clear filters */}
          {(tableQuery.filters ?? []).length > 0 && (
            <button
              className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-200 py-1.5 px-3 rounded-lg hover:bg-neutral-800/60 transition-colors cursor-pointer"
              onClick={() => {
                setTableQuery((prev) => ({
                  ...prev,
                  page: 1,
                  filters: [],
                }));
              }}
            >
              <FilterX size={14} />
              <span>Clear Filters</span>
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2 pt-4 border-t border-neutral-800/60 text-xs text-neutral-400">
          <div>
            Showing <span className="font-semibold text-neutral-200">{total === 0 ? 0 : (tableQuery.page - 1) * tableQuery.pageSize + 1}</span> to{" "}
            <span className="font-semibold text-neutral-200">{Math.min(tableQuery.page * tableQuery.pageSize, total)}</span> of{" "}
            <span className="font-semibold text-neutral-200">{total}</span> users
          </div>

          <div className="flex items-center gap-2">
            <button
              className="flex items-center justify-center p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 hover:text-neutral-200 disabled:opacity-40 disabled:hover:bg-neutral-900 disabled:hover:text-neutral-400 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer"
              disabled={tableQuery.page <= 1}
              onClick={() => {
                setTableQuery((prev) => ({
                  ...prev,
                  page: Math.max(prev.page - 1, 1),
                }));
              }}
            >
              <ChevronLeft size={14} />
            </button>
            
            <span className="px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-300 font-semibold text-[10px]">
              Page {tableQuery.page} of {Math.ceil(total / tableQuery.pageSize) || 1}
            </span>

            <button
              className="flex items-center justify-center p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 hover:text-neutral-200 disabled:opacity-40 disabled:hover:bg-neutral-900 disabled:hover:text-neutral-400 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer"
              disabled={tableQuery.page * tableQuery.pageSize >= total}
              onClick={() => {
                setTableQuery((prev) => ({
                  ...prev,
                  page: prev.page + 1,
                }));
              }}
            >
              <ChevronRight size={14} />
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
