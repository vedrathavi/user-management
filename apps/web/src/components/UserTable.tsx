import type { User } from "@repo/types";

interface Props {
  users: User[];
}

const UserTable = ({ users }: Props) => {
  return (
    <table className="w-full table-auto border-collapse border-neutral-800 text-center">
      <thead>
        <tr className="bg-neutral-900/60">
          <th className="border border-neutral-800 p-2">First Name</th>
          <th className="border border-neutral-800 p-2">Last Name</th>
          <th className="border border-neutral-800 p-2">Email</th>
          <th className="border border-neutral-800 p-2">Phone No.</th>
          <th className="border border-neutral-800 p-2">Role</th>
          <th className="border border-neutral-800 p-2">Status</th>
          <th className="border border-neutral-800 p-2">Department</th>
        </tr>
      </thead>

      <tbody>
        {users.map((user) => (
          <tr key={user.id} className="hover:bg-neutral-800/20">
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
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
