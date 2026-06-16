import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import UserSchema, { type UserFormData } from "../utils/userSchema";
import { X, User, Mail, Phone, Briefcase, Info, BadgeAlert } from "lucide-react";

interface Props {
  user?: UserFormData | null;
  onSubmit: (data: UserFormData) => void;
  onClose: () => void;
}

const UserForm = ({ user, onSubmit, onClose }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({ resolver: zodResolver(UserSchema) });

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
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300"
        onClick={() => {
          reset();
          onClose();
        }}
      />

      {/* Modal Card */}
      <div
        className="relative z-10 w-full max-w-2xl rounded-3xl border border-neutral-800 bg-neutral-950/90 p-6 md:p-8 shadow-2xl backdrop-blur-md transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800/60 pb-4 mb-6">
          <h2 className="text-xl font-bold text-neutral-100 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            {user ? "Edit User Account" : "Add New User Account"}
          </h2>
          <button
            className="rounded-lg p-1.5 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-all duration-150 cursor-pointer"
            onClick={() => {
              reset();
              onClose();
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
                <User size={12} />
                <span>First Name</span>
              </label>
              <input
                type="text"
                placeholder="John"
                {...register("firstName")}
                className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500/50 transition-all duration-150 text-sm"
              />
              {errors.firstName && (
                <p className="text-xs text-red-400 flex items-center gap-1 mt-0.5">
                  <BadgeAlert size={10} />
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
                <User size={12} />
                <span>Last Name</span>
              </label>
              <input
                type="text"
                placeholder="Doe"
                {...register("lastName")}
                className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500/50 transition-all duration-150 text-sm"
              />
              {errors.lastName && (
                <p className="text-xs text-red-400 flex items-center gap-1 mt-0.5">
                  <BadgeAlert size={10} />
                  {errors.lastName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
                <Mail size={12} />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                placeholder="john.doe@example.com"
                {...register("email")}
                className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500/50 transition-all duration-150 text-sm"
              />
              {errors.email && (
                <p className="text-xs text-red-400 flex items-center gap-1 mt-0.5">
                  <BadgeAlert size={10} />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
                <Phone size={12} />
                <span>Phone Number (Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 555-0199"
                {...register("phone")}
                className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500/50 transition-all duration-150 text-sm"
              />
              {errors.phone && (
                <p className="text-xs text-red-400 flex items-center gap-1 mt-0.5">
                  <BadgeAlert size={10} />
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
                <Info size={12} />
                <span>Account Status</span>
              </label>
              <select
                {...register("status")}
                className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500/50 transition-all duration-150 text-sm"
              >
                <option value="">Select Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              {errors.status && (
                <p className="text-xs text-red-400 flex items-center gap-1 mt-0.5">
                  <BadgeAlert size={10} />
                  {errors.status.message}
                </p>
              )}
            </div>

            {/* Role */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
                <Info size={12} />
                <span>System Role</span>
              </label>
              <select
                {...register("role")}
                className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500/50 transition-all duration-150 text-sm"
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
              {errors.role && (
                <p className="text-xs text-red-400 flex items-center gap-1 mt-0.5">
                  <BadgeAlert size={10} />
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Department */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
                <Briefcase size={12} />
                <span>Department Name (Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Engineering, Sales"
                {...register("department")}
                className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500/50 transition-all duration-150 text-sm"
              />
              {errors.department && (
                <p className="text-xs text-red-400 flex items-center gap-1 mt-0.5">
                  <BadgeAlert size={10} />
                  {errors.department.message}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-neutral-800/60">
            <button
              type="button"
              className="rounded-xl border border-neutral-850 bg-neutral-900 hover:bg-neutral-800 hover:text-neutral-100 text-neutral-300 font-semibold px-5 py-2.5 text-xs transition-all duration-150 cursor-pointer"
              onClick={() => {
                reset();
              }}
            >
              Clear Form
            </button>
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-6 py-2.5 text-xs transition-all duration-150 shadow-md shadow-indigo-500/10 cursor-pointer"
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
