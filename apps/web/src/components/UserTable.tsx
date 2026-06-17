import type { User } from "@repo/types";
import type { FilterValuesDto } from "../utils/filters";
import { useState } from "react";
import FilterMenu from "./FilterMenu";
import { Filter, Edit, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface Props {
  users: User[];
  filterOptions: Record<string, string[]>;
  selectedFilters: FilterValuesDto[];
  onValueToggle: (field: string, value: string) => void;
  onSelectAll: (field: string, allValues: string[]) => void;
  onClearAll: (field: string) => void;
  onOperatorApply: (field: string, operator: string, value: string) => void;
  onOperatorClear: (field: string, operator?: string) => void;
  onEdit?: (user: User) => void;
  onDelete?: (id: string) => void;
  onSort?: (field: string) => void;
  sort?: { field: string; order: "ASC" | "DESC" } | undefined;
}

const UserTable = ({
  users,
  filterOptions,
  selectedFilters,
  onValueToggle,
  onSelectAll,
  onClearAll,
  onOperatorApply,
  onOperatorClear,
  onEdit,
  onDelete,
  onSort,
  sort,
}: Props) => {
  const { user: currentUser } = useAuth();
  const [openFilters, setOpenFilters] = useState<string | null>(null);
  const [menuCoords, setMenuCoords] = useState<{ top: number; left: number } | null>(null);

  const getSelectedValues = (field: string) => {
    return selectedFilters.find((filter) => filter.field === field)?.values ?? [];
  };

  const renderRoleBadge = (role: string) => {
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

  const renderStatusPill = (status: string) => {
    const isActive = status === "active";
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold border ${
          isActive
            ? "bg-green-500/10 text-green-400 border-green-500/20"
            : "bg-red-500/10 text-red-400 border-red-500/20"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            isActive ? "bg-green-400 animate-pulse" : "bg-red-400"
          }`}
        />
        <span className="capitalize">{status}</span>
      </span>
    );
  };

  const renderFilterableHeader = (label: string, field: string) => {
    const selectedValues = getSelectedValues(field);
    const hasOperatorFilter = selectedFilters.some((f) => f.field === field && f.operator);
    const isFiltered = selectedValues.length > 0 || hasOperatorFilter;
    const options = filterOptions[field] ?? [];

    return (
      <th className="relative border-x border-neutral-800 p-2.5 text-xs font-semibold text-neutral-300">
        <div className="flex items-center justify-between gap-2 px-1">
          <span
            className={`transition-colors duration-200 ${
              isFiltered ? "text-blue-400 font-bold" : "text-neutral-300"
            }`}
          >
            {label}
          </span>
          <button
            className={`cursor-pointer rounded-lg p-1 transition-all duration-200 hover:bg-neutral-800 ${
              isFiltered ? "text-blue-400 bg-blue-500/10 border border-blue-500/20" : "text-neutral-500"
            }`}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const menuWidth = 256;
              const top = rect.bottom + window.scrollY + 8;
              let left = rect.right - menuWidth + window.scrollX;
              if (left < window.scrollX) {
                left = rect.left + window.scrollX;
              }
              setMenuCoords({ top, left });
              setOpenFilters(openFilters === field ? null : field);
            }}
          >
            <Filter size={11} className={isFiltered ? "fill-blue-500/10" : ""} />
          </button>
        </div>

        <FilterMenu
          field={field}
          options={options}
          selectedValues={selectedValues}
          onToggle={onValueToggle}
          onSelectAll={onSelectAll}
          onClearAll={onClearAll}
          selectedFilters={selectedFilters}
          onOperatorApply={onOperatorApply}
          onOperatorClear={onOperatorClear}
          isOpen={openFilters === field}
          onClose={() => setOpenFilters(null)}
          onSort={onSort}
          sort={sort}
          coords={menuCoords}
        />
      </th>
    );
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-950/20 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
      <table className="w-full table-auto border-collapse text-left text-sm">
        <thead>
          <tr className="bg-neutral-900/40 border-b border-neutral-800 text-[11px] uppercase tracking-wider text-neutral-400">
            <th className="border-b border-neutral-800 py-3 px-3 font-semibold text-neutral-400 text-center w-14">
              Sr. No.
            </th>
            {renderFilterableHeader("Created At", "createdAt")}
            {renderFilterableHeader("First Name", "firstName")}
            {renderFilterableHeader("Last Name", "lastName")}
            {renderFilterableHeader("Email", "email")}
            {renderFilterableHeader("Phone", "phone")}
            {renderFilterableHeader("Role", "role")}
            {renderFilterableHeader("Status", "status")}
            {renderFilterableHeader("Department", "department")}
            <th className="border-b border-neutral-800 p-2.5 font-semibold text-neutral-400 text-center w-24">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-neutral-800/60">
          {users.map((user, index) => (
            <tr key={user.id} className="hover:bg-neutral-800/10 transition-colors duration-150">
              <td className="py-2.5 px-3 text-neutral-400 text-center text-xs">
                {index + 1}
              </td>
              <td className="p-2.5 text-neutral-300 text-xs">
                {new Date(user.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </td>
              <td className="p-2.5 text-neutral-200 font-medium text-xs">
                {user.firstName}
              </td>
              <td className="p-2.5 text-neutral-200 font-medium text-xs">
                {user.lastName}
              </td>
              <td className="p-2.5 text-neutral-300 text-xs truncate max-w-[150px]" title={user.email}>
                {user.email}
              </td>
              <td className="p-2.5 text-neutral-400 text-xs">
                {user.phone || "—"}
              </td>
              <td className="p-2.5 text-xs">
                {renderRoleBadge(user.role)}
              </td>
              <td className="p-2.5 text-xs">
                {renderStatusPill(user.status)}
              </td>
              <td className="p-2.5 text-neutral-300 text-xs">
                {user.department || "—"}
              </td>
              <td className="p-2.5 text-center">
                <div className="flex items-center justify-center gap-1.5">
                  {/* Edit Button */}
                  {currentUser && (currentUser.role === 'admin' || (currentUser.role === 'editor' && user.role !== 'admin') || user.id === currentUser.id) && (
                    <button
                      className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 hover:border-neutral-700 transition-all duration-150 cursor-pointer"
                      onClick={() => {
                        if (onEdit) onEdit(user);
                      }}
                      title="Edit User"
                    >
                      <Edit size={12} />
                    </button>
                  )}
                  {/* Delete Button */}
                  {currentUser && currentUser.role === 'admin' && (
                    <button
                      disabled={user.id === currentUser.id}
                      className="p-2 rounded-lg bg-red-950/10 border border-red-900/20 text-red-400 hover:text-red-300 hover:bg-red-950/20 hover:border-red-900/40 transition-all duration-150 disabled:opacity-40 disabled:hover:bg-red-950/10 disabled:hover:border-red-900/20 disabled:hover:text-red-400 disabled:cursor-not-allowed cursor-pointer"
                      onClick={() => {
                        if (onDelete) onDelete(user.id);
                      }}
                      title={user.id === currentUser.id ? "You cannot delete your own account" : "Delete User"}
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}

          {users.length === 0 && (
            <tr>
              <td
                colSpan={10}
                className="py-12 text-center text-xs text-neutral-500"
              >
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
