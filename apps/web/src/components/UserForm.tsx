import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import type { User } from "@repo/types";
import UserSchema, { type UserFormData } from "../utils/userSchema";

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
  } = useForm<UserFormData>({ resolver: zodResolver(UserSchema), });

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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => {
          reset();
          onClose();
        }}
      />
      <div
        className="relative z-10 w-full max-w-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full max-w-xl bg-neutral-900 p-2 rounded-4xl gap-1 flex flex-col">
          <button
            className="self-end text-red-500 hover:text-red-600 "
            onClick={() => {
              reset();
              onClose();
            }}
          >
            Close
                  </button>
                  
          <div>
            <h2 className="text-lg  mb-4 text-center">{user ? "Edit User" : "Add New User"}</h2>
                  </div>
                  

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full bg-neutral-900 px-4 mb-4 rounded-4xl gap-4 flex flex-col"
          >
            <div>
              <input
                type="text"
                placeholder="First Name"
                {...register("firstName")}
                className="w-full mb-2 p-3 bg-neutral-800 text-neutral-100 rounded-lg"
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="text"
                placeholder="Last Name"
                {...register("lastName")}
                className="w-full mb-2 p-3 bg-neutral-800 text-neutral-100 rounded-lg"
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="email"
                placeholder="Email"
                {...register("email")}
                className="w-full mb-2 p-3 bg-neutral-800 text-neutral-100 rounded-lg"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                placeholder="Phone (optional)"
                {...register("phone")}
                className="w-full mb-2 p-3 bg-neutral-800 text-neutral-100 rounded-lg"
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <select
                {...register("status")}
                className="w-full mb-2 p-3 rounded-lg bg-neutral-800 text-neutral-100"
              >
                <option value="">Select Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status.message}</p>
              )}
            </div>

            <div>
              <select
                {...register("role")}
                className="w-full mb-2 p-3 rounded-lg bg-neutral-800 text-neutral-100"
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role.message}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                placeholder="Department (optional)"
                {...register("department")}
                className="w-full mb-2 p-3 rounded-lg bg-neutral-800 text-neutral-100"
              />
              {errors.department && (
                <p className="text-sm text-red-500">
                  {errors.department.message}
                </p>
              )}
            </div>

            <div className="w-full flex gap-4">
              <button
                type="submit"
                className="w-full bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-semibold py-4 px-4 rounded-xl"
              >
                Submit
              </button>
              <button
                type="button"
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-4 rounded-xl"
                onClick={() => {
                  reset();
                }}
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
