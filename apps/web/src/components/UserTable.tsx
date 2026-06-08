import type { User } from "@repo/types";
import type { UserFilters } from "../utils/filters";
import { useState } from "react";
import FilterMenu from "./FilterMenu";

interface Props {
  users: User[];
  filters: UserFilters;
  onFilterChange: (filters: UserFilters) => void;
  onEdit?: (user: User) => void;
  onDelete?: (id: string) => void;
}

const UserTable = ({ users, filters, onFilterChange, onEdit, onDelete }: Props) => {

  const [openFilters, setOpenFilters] = useState<string | null>(null);
  

  return (
    <table className="w-full table-auto border-collapse border-neutral-800 text-center">
      <thead>
        <tr className="bg-neutral-900/60">
          <th className="border border-neutral-800 py-2 px-1">Sr. No.</th>

          <th className="border border-neutral-800 p-2">
            <span className={`filter-indicator ${!filters.createdFrom && !filters.createdTo ? "" : "text-blue-500"}`}>
              Created At
            </span>
            <button
              className="ml-1 text-sm text-neutral-400"
              onClick={() =>
                setOpenFilters(openFilters === "createdAt" ? null : "createdAt")
              }
            >
              ⬇️ 
            </button>

            <FilterMenu
              isOpen={openFilters === "createdAt"}
              onClose={() => setOpenFilters(null)}
            >
              <>
                <label className="flex flex-col gap-1">
                  From:
                  <input
                    type="date"
                    value={filters.createdFrom || ""}
                    onChange={(e) =>
                      onFilterChange({
                        ...filters,
                        createdFrom: e.target.value || undefined,
                      })
                    }
                    className="w-full p-2 bg-neutral-800 text-neutral-100 rounded-lg"
                  />
                </label>

                <label className="flex flex-col gap-1 mt-2">
                  To:
                  <input

                    type="date"
                    value={filters.createdTo || ""}
                    onChange={(e) =>
                      onFilterChange({
                        ...filters,
                        createdTo: e.target.value || undefined,
                      })
                    }
                    className="w-full p-2 bg-neutral-800 text-neutral-100 rounded-lg"
                  />
                </label>
              </>
            </FilterMenu>

          </th>
          <th className=" relative border border-neutral-800 p-2">
            <span className={`filter-indicator ${!filters.firstName ? "" : "text-blue-500"}`}>
              First Name
            </span>
            <button
              className="ml-1 text-sm text-neutral-400"
              onClick={() =>
                setOpenFilters(openFilters === "firstName" ? null : "firstName")
              }
            >
              ⬇️
            </button>
            <FilterMenu
              isOpen={openFilters === "firstName"}
              onClose={() => setOpenFilters(null)}
            >
              <>
                <select
                  value={filters.firstName?.operator || "contains"}
                  onChange={(e) =>
                    onFilterChange({
                      ...filters,
                      firstName: {
                        operator: e.target
                          .value as UserFilters["firstName"]["operator"],
                        value: filters.firstName?.value || "",
                      },
                    })
                  }
                  className="w-full p-2 bg-neutral-800 text-neutral-100 rounded-lg"
                >
                  <option value="contains">Contains</option>
                  <option value="equals">Equals</option>
                  <option value="startsWith">Starts With</option>
                  <option value="endsWith">Ends With</option>
                </select>
                <input
                  type="text"
                  placeholder="Search..."
                  value={filters.firstName?.value || ""}
                  onChange={(e) =>
                    onFilterChange({
                      ...filters,
                      firstName: {
                        operator: filters.firstName?.operator || "contains",
                        value: e.target.value,
                      },
                    })
                  }
                  className="w-full mt-2 p-2 bg-neutral-800 text-neutral-100 rounded-lg"
                />
              </>
            </FilterMenu>
          </th>
          <th className="border border-neutral-800 p-2">
            <span className={`filter-indicator ${!filters.lastName ? "" : "text-blue-500"}`}>
              Last Name
            </span>
            <button
              className="ml-1 text-sm text-neutral-400"
              onClick={() =>
                setOpenFilters(openFilters === "lastName" ? null : "lastName")
              }
            >
              ⬇️
            </button>
            <FilterMenu
              isOpen={openFilters === "lastName"}
              onClose={() => setOpenFilters(null)}
            >
              <>
                <select
                  value={filters.lastName?.operator || "contains"}
                  onChange={(e) =>
                    onFilterChange({
                      ...filters,
                      lastName: {
                        operator: e.target
                          .value as UserFilters["lastName"]["operator"],
                        value: filters.lastName?.value || "",
                      },
                    })
                  }
                  className="w-full p-2 bg-neutral-800 text-neutral-100 rounded-lg"
                >
                  <option value="contains">Contains</option>
                  <option value="equals">Equals</option>
                  <option value="startsWith">Starts With</option>
                  <option value="endsWith">Ends With</option>
                </select>
                <input
                  type="text"
                  placeholder="Search..."
                  value={filters.lastName?.value || ""}
                  onChange={(e) =>
                    onFilterChange({
                      ...filters,
                      lastName: {
                        operator: filters.lastName?.operator || "contains",
                        value: e.target.value,
                      },
                    })
                  }
                  className="w-full mt-2 p-2 bg-neutral-800 text-neutral-100 rounded-lg"
                />
              </>
            </FilterMenu>
          </th>
          <th className="border border-neutral-800 p-2">
            <span className={`filter-indicator ${!filters.email ? "" : "text-blue-500"}`}>
              Email
            </span>
            <button
              className="ml-1 text-sm text-neutral-400"
              onClick={() =>
                setOpenFilters(openFilters === "email" ? null : "email")
              }
            >
              ⬇️
            </button>
            <FilterMenu
              isOpen={openFilters === "email"}
              onClose={() => setOpenFilters(null)}
            >
              <>
                <select
                  value={filters.email?.operator || "contains"}
                  onChange={(e) =>
                    onFilterChange({
                      ...filters,
                      email: {
                        operator: e.target
                          .value as UserFilters["email"]["operator"],
                        value: filters.email?.value || "",
                      },
                    })
                  }
                  className="w-full p-2 bg-neutral-800 text-neutral-100 rounded-lg"
                >
                  <option value="contains">Contains</option>
                  <option value="equals">Equals</option>
                  <option value="startsWith">Starts With</option>
                  <option value="endsWith">Ends With</option>
                </select>
                <input
                  type="text"
                  placeholder="Search..."
                  value={filters.email?.value || ""}
                  onChange={(e) =>
                    onFilterChange({
                      ...filters,
                      email: {
                        operator: filters.email?.operator || "contains",
                        value: e.target.value,
                      },
                    })
                  }
                  className="w-full mt-2 p-2 bg-neutral-800 text-neutral-100 rounded-lg"
                />
              </>
            </FilterMenu>
          </th>
          <th className="border border-neutral-800 p-2">
            <span className={`filter-indicator ${!filters.phone ? "" : "text-blue-500"}`}>
              Phone
            </span>
            <button
              className="ml-1 text-sm text-neutral-400"
              onClick={() =>
                setOpenFilters(openFilters === "phone" ? null : "phone")
              }
            >
              ⬇️
            </button>
            <FilterMenu
              isOpen={openFilters === "phone"}
              onClose={() => setOpenFilters(null)}
            >
              <>
                <select
                  value={filters.phone?.operator || "contains"}
                  onChange={(e) =>
                    onFilterChange({
                      ...filters,
                      phone: {
                        operator: e.target
                          .value as UserFilters["phone"]["operator"],
                        value: filters.phone?.value || "",
                      },
                    })
                  }
                  className="w-full p-2 bg-neutral-800 text-neutral-100 rounded-lg"
                >
                  <option value="contains">Contains</option>
                  <option value="equals">Equals</option>
                  <option value="startsWith">Starts With</option>
                  <option value="endsWith">Ends With</option>
                </select>
                <input
                  type="text"
                  placeholder="Search..."
                  value={filters.phone?.value || ""}
                  onChange={(e) =>
                    onFilterChange({
                      ...filters,
                      phone: {
                        operator: filters.phone?.operator || "contains",
                        value: e.target.value,
                      },
                    })
                  }
                  className="w-full mt-2 p-2 bg-neutral-800 text-neutral-100 rounded-lg"
                />
              </>
            </FilterMenu>
          </th>
          <th className="border border-neutral-800 p-2">
            <span className={`filter-indicator ${!filters.role ? "" : "text-blue-500"}`}>
              Role
            </span>
            <button
              className="ml-1 text-sm text-neutral-400"
              onClick={() =>
                setOpenFilters(openFilters === "role" ? null : "role")
              }
            >
              ⬇️
            </button>
            <FilterMenu
              isOpen={openFilters === "role"}
              onClose={() => setOpenFilters(null)}
            >
              <>
                <select
                  value={
                    filters.role === "all"
                      ? "all"
                      : filters.role?.join(",") || "all"
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    onFilterChange({
                      ...filters,
                      role:
                        value === "all"
                          ? "all"
                          : (value.split(",") as UserFilters["role"]),
                    });
                  }}
                  className="w-full p-2 bg-neutral-800 text-neutral-100 rounded-lg"
                >
                  <option value="all">All</option>
                  <option value="admin">Admin</option>
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                </select>
              </>
            </FilterMenu>
          </th>
          <th className="border border-neutral-800 p-2">
            <span
              className={`filter-indicator ${!filters.status ? "" : "text-blue-500"}`}
            >
              Status
            </span>
            <button
              className="ml-1 text-sm text-neutral-400"
              onClick={() =>
                setOpenFilters(openFilters === "status" ? null : "status")
              }
            >
              ⬇️
            </button>

            <FilterMenu
              isOpen={openFilters === "status"}
              onClose={() => setOpenFilters(null)}
            >
              <>
                <select
                  value={
                    filters.status === "all"
                      ? "all"
                      : filters.status?.join(",") || "all"
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    onFilterChange({
                      ...filters,
                      status:
                        value === "all"
                          ? "all"
                          : (value.split(",") as UserFilters["status"]),
                    });
                  }}
                  className="w-full p-2 bg-neutral-800 text-neutral-100 rounded-lg "
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </>
            </FilterMenu>
          </th>
          <th className="border border-neutral-800 p-2">
            <span className={`filter-indicator ${!filters.department ? "" : "text-blue-500"}`}>
              Department
            </span>
            <button
              className="ml-1 text-sm text-neutral-400"
              onClick={() =>
                setOpenFilters(
                  openFilters === "department" ? null : "department",
                )
              }
            >
              ⬇️
            </button>
            <FilterMenu
              isOpen={openFilters === "department"}
              onClose={() => setOpenFilters(null)}
            >
              <>
                <select
                  value={filters.department?.operator || "contains"}
                  onChange={(e) =>
                    onFilterChange({
                      ...filters,
                      department: {
                        operator: e.target
                          .value as UserFilters["department"]["operator"],
                        value: filters.department?.value || "",
                      },
                    })
                  }
                  className="w-full p-2 bg-neutral-800 text-neutral-100 rounded-lg"
                >
                  <option value="contains">Contains</option>
                  <option value="equals">Equals</option>
                  <option value="startsWith">Starts With</option>
                  <option value="endsWith">Ends With</option>
                </select>
                <input
                  type="text"
                  placeholder="Search..."
                  value={filters.department?.value || ""}
                  onChange={(e) =>
                    onFilterChange({
                      ...filters,
                      department: {
                        operator: filters.department?.operator || "contains",
                        value: e.target.value,
                      },
                    })
                  }
                  className="w-full mt-2 p-2 bg-neutral-800 text-neutral-100 rounded-lg"
                />
              </>
            </FilterMenu>
          </th>
          <th className="border border-neutral-800 p-2">Actions</th>
        </tr>
      </thead>

      <tbody>
        {users.map((user, index) => (
          <tr key={user.id} className="hover:bg-neutral-800/20">
            <td className="border border-neutral-800 px-1 py-2">{index + 1}</td>
            <td className="border border-neutral-800 p-2">
              {new Date(user.createdAt).toLocaleDateString()}
            </td>
            <td className="border border-neutral-800 p-2">{user.firstName}</td>
            <td className="border border-neutral-800 p-2">{user.lastName}</td>
            <td className="border border-neutral-800 p-2">{user.email}</td>
            <td className="border border-neutral-800 p-2">
              {user.phone || "N/A"}
            </td>
            <td className="border border-neutral-800 p-2">{user.role}</td>
            <td className="border border-neutral-800 p-2">{user.status}</td>
            <td className="border border-neutral-800 p-2">
              {user.department || "N/A"}
            </td>
            <td className="border border-neutral-800 p-2">
              {/* Edit Button */}
              <button
                className="bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-semibold py-2 px-4 rounded"
                onClick={() => {
                  if (onEdit) onEdit(user);
                }}
              >
                Edit
              </button>
              {/* Delete Button */}
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded ml-2"
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
              colSpan={12}
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
