import type { User } from "@repo/types";
import type { FilterValuesDto } from "../utils/filters";
import { useState } from "react";
import FilterMenu from "./FilterMenu";

interface Props {
  users: User[];
  filterOptions: Record<string, string[]>;
  selectedFilters: FilterValuesDto[];
  onValueToggle: (field: string, value: string) => void;
  onSelectAll: (field: string, allValues: string[]) => void;
  onClearAll: (field: string) => void;
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
  onEdit,
  onDelete,
  onSort,
  sort,
}: Props) => {
  const [openFilters, setOpenFilters] = useState<string | null>(null);

  const getSelectedValues = (field: string) => {
    return selectedFilters.find((filter) => filter.field === field)?.values ?? [];
  };

  const renderFilterableHeader = (label: string, field: string) => {
    const selectedValues = getSelectedValues(field);
    const isFiltered = selectedValues.length > 0;
    const options = filterOptions[field] ?? [];

    return (
      <th className="relative border border-neutral-800 p-2">
        <div className="flex items-center justify-between gap-1 px-1">
          <span
            className={`font-semibold transition-colors duration-200 ${
              isFiltered ? "text-blue-400" : "text-neutral-200"
            }`}
          >
            {label}
          </span>
          <button
            className={`cursor-pointer rounded p-1 transition-all duration-200 hover:bg-neutral-800 ${
              isFiltered ? "text-blue-400 font-bold" : "text-neutral-500"
            }`}
            onClick={() => setOpenFilters(openFilters === field ? null : field)}
          >
            {isFiltered ? "☑" : "⬇️"}
          </button>
        </div>

        <FilterMenu
          field={field}
          options={options}
          selectedValues={selectedValues}
          onToggle={onValueToggle}
          onSelectAll={onSelectAll}
          onClearAll={onClearAll}
          isOpen={openFilters === field}
          onClose={() => setOpenFilters(null)}
          onSort={onSort}
          sort={sort}
        />
      </th>
    );
  };

  return (
    <table className="w-full table-auto border-collapse border-neutral-800 text-center">
      <thead>
        <tr className="bg-neutral-900/60">
          <th className="border border-neutral-800 py-2 px-1 text-sm font-semibold text-neutral-200">
            Sr. No.
          </th>

          <th className="border border-neutral-800 p-2">
            <button
              onClick={() => onSort?.("createdAt")}
              className="flex cursor-pointer items-center justify-center gap-1 w-full font-semibold text-neutral-200 hover:text-blue-400 transition-colors duration-200"
            >
              <span>Created At</span>
              {sort?.field === "createdAt" && (
                <span className="text-blue-400 font-bold">
                  {sort.order === "ASC" ? " ↑" : " ↓"}
                </span>
              )}
            </button>
          </th>

          {renderFilterableHeader("First Name", "firstName")}
          {renderFilterableHeader("Last Name", "lastName")}
          {renderFilterableHeader("Email", "email")}
          {renderFilterableHeader("Phone", "phone")}
          {renderFilterableHeader("Role", "role")}
          {renderFilterableHeader("Status", "status")}
          {renderFilterableHeader("Department", "department")}

          <th className="border border-neutral-800 p-2 font-semibold text-neutral-200">
            Actions
          </th>
        </tr>
      </thead>

      <tbody>
        {users.map((user, index) => (
          <tr key={user.id} className="hover:bg-neutral-800/20 transition-colors duration-150">
            <td className="border border-neutral-800 px-1 py-2 text-neutral-300">
              {index + 1}
            </td>
            <td className="border border-neutral-800 p-2 text-neutral-300">
              {new Date(user.createdAt).toLocaleDateString()}
            </td>
            <td className="border border-neutral-800 p-2 text-neutral-300">
              {user.firstName}
            </td>
            <td className="border border-neutral-800 p-2 text-neutral-300">
              {user.lastName}
            </td>
            <td className="border border-neutral-800 p-2 text-neutral-300">
              {user.email}
            </td>
            <td className="border border-neutral-800 p-2 text-neutral-300">
              {user.phone || "N/A"}
            </td>
            <td className="border border-neutral-800 p-2 text-neutral-300">
              {user.role}
            </td>
            <td className="border border-neutral-800 p-2 text-neutral-300">
              {user.status}
            </td>
            <td className="border border-neutral-800 p-2 text-neutral-300">
              {user.department || "N/A"}
            </td>
            <td className="border border-neutral-800 p-2">
              {/* Edit Button */}
              <button
                className="bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-semibold py-1.5 px-3 rounded text-sm transition-all duration-150"
                onClick={() => {
                  if (onEdit) onEdit(user);
                }}
              >
                Edit
              </button>
              {/* Delete Button */}
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1.5 px-3 rounded ml-2 text-sm transition-all duration-150"
                onClick={() => {
                  if (onDelete) onDelete(user.id);
                }}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}

        {users.length === 0 && (
          <tr>
            <td
              colSpan={10}
              className="border border-neutral-800 p-4 text-center text-neutral-400"
            >
              No users found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default UserTable;

