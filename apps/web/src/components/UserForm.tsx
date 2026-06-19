import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import UserSchema, { type UserFormData } from "../utils/userSchema";
import type { User } from "@repo/types";
import { useAuth } from "../context/AuthContext";

interface Props {
  user?: User | null;
  onSubmit: (data: UserFormData) => void;
  onClose: () => void;
}

const UserForm = ({ user, onSubmit, onClose }: Props) => {
  const { user: currentUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({ resolver: zodResolver(UserSchema) });

  const isRoleDisabled = !!user && (currentUser?.role === "editor" || user.id === currentUser?.id);
  const isStatusDisabled = currentUser?.role === "viewer" || (!!user && user.id === currentUser?.id);

  const renderStatusPill = (status: string) => {
    const isActive = status === "active";
    return (
      <span className={`capitalize text-xs font-semibold ${isActive ? "text-green-500" : "text-red-500"}`}>
        {status}
      </span>
    );
  };

  const renderRoleBadge = (role: string) => {
    return <span className="capitalize text-xs font-semibold text-neutral-300">{role}</span>;
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        reset();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [reset, onClose]);

  useEffect(() => {
    reset(user ?? undefined);
  }, [user, reset]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Flat Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={() => {
          reset();
          onClose();
        }}
      />

      {/* Modal Card */}
      <div
        className="relative z-10 w-full max-w-2xl rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-4">
          <h2 className="text-lg font-bold text-neutral-100">
            {user ? "Edit User Account" : "Add New User Account"}
          </h2>
          <button
            className="rounded-lg px-2 py-0.5 text-neutral-400 hover:text-neutral-100 cursor-pointer text-xl leading-none"
            onClick={() => {
              reset();
              onClose();
            }}
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-neutral-400">First Name</label>
              <input
                type="text"
                placeholder="John"
                {...register("firstName")}
                className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 rounded-lg px-3 py-2 outline-none focus:border-indigo-650 transition-colors text-sm"
              />
              {errors.firstName && (
                <p className="text-xs text-red-400 mt-0.5">{errors.firstName.message}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-neutral-400">Last Name</label>
              <input
                type="text"
                placeholder="Doe"
                {...register("lastName")}
                className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 rounded-lg px-3 py-2 outline-none focus:border-indigo-650 transition-colors text-sm"
              />
              {errors.lastName && (
                <p className="text-xs text-red-400 mt-0.5">{errors.lastName.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-neutral-400">Email Address</label>
              <input
                type="email"
                placeholder="john.doe@example.com"
                {...register("email")}
                className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 rounded-lg px-3 py-2 outline-none focus:border-indigo-650 transition-colors text-sm"
              />
              {errors.email && (
                <p className="text-xs text-red-400 mt-0.5">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-neutral-400">Phone Number (Optional)</label>
              <input
                type="text"
                placeholder="e.g. 5550199"
                {...register("phone")}
                className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 rounded-lg px-3 py-2 outline-none focus:border-indigo-650 transition-colors text-sm"
              />
              {errors.phone && (
                <p className="text-xs text-red-400 mt-0.5">{errors.phone.message}</p>
              )}
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-neutral-400">Account Status</label>
              {isStatusDisabled ? (
                <div className="flex items-center h-[38px] bg-neutral-950 border border-neutral-800 px-3 rounded-lg">
                  <input type="hidden" {...register("status")} />
                  {renderStatusPill(user?.status || "active")}
                </div>
              ) : (
                <select
                  {...register("status")}
                  className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 rounded-lg px-3 py-2 outline-none focus:border-indigo-650 transition-colors text-sm"
                >
                  <option value="">Select Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              )}
              {errors.status && (
                <p className="text-xs text-red-400 mt-0.5">{errors.status.message}</p>
              )}
            </div>

            {/* Role */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-neutral-400">System Role</label>
              {isRoleDisabled ? (
                <div className="flex items-center h-[38px] bg-neutral-950 border border-neutral-800 px-3 rounded-lg">
                  <input type="hidden" {...register("role")} />
                  {renderRoleBadge(user?.role || "viewer")}
                </div>
              ) : (
                <select
                  {...register("role")}
                  className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 rounded-lg px-3 py-2 outline-none focus:border-indigo-650 transition-colors text-sm"
                >
                  <option value="">Select Role</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              )}
              {errors.role && (
                <p className="text-xs text-red-400 mt-0.5">{errors.role.message}</p>
              )}
            </div>

            {/* Department */}
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-xs font-medium text-neutral-400">Department Name (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Engineering, Sales"
                {...register("department")}
                className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 rounded-lg px-3 py-2 outline-none focus:border-indigo-650 transition-colors text-sm"
              />
              {errors.department && (
                <p className="text-xs text-red-400 mt-0.5">{errors.department.message}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-neutral-800">
            <button
              type="button"
              className="rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-850 hover:text-neutral-100 text-neutral-300 font-medium px-4 py-2 text-xs transition-colors cursor-pointer"
              onClick={() => {
                reset();
              }}
            >
              Clear Form
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2 text-xs transition-colors cursor-pointer"
            >
              {user ? "Save Changes" : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
