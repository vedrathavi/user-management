import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
// Styled using flat basic style

const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const { register: signup } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setApiError(null);
    try {
      await signup(data.firstName, data.lastName, data.email, data.password);
      setSuccess(true);
      reset();
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setApiError((err as Error).message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-950 p-4">
      {/* Basic Flat Card Container */}
      <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900 p-8 shadow-md">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-1 mb-6">
          <h2 className="text-xl font-bold text-neutral-100">Create an account</h2>
          <p className="text-xs text-neutral-400">Join the user management directory</p>
        </div>

        {/* Alerts */}
        {apiError && (
          <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-450">
            <p>{apiError}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg border border-green-500/20 bg-green-500/5 p-3 text-xs text-green-450">
            <p>Registration successful! Redirecting to login...</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-neutral-400">First Name</label>
              <input
                type="text"
                placeholder="John"
                disabled={loading || success}
                {...register("firstName")}
                className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 rounded-lg px-3 py-2 outline-none focus:border-indigo-600 transition-colors text-sm disabled:opacity-50"
              />
              {errors.firstName && (
                <p className="text-[11px] text-red-400 mt-0.5">{errors.firstName.message}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-neutral-400">Last Name</label>
              <input
                type="text"
                placeholder="Doe"
                disabled={loading || success}
                {...register("lastName")}
                className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 rounded-lg px-3 py-2 outline-none focus:border-indigo-600 transition-colors text-sm disabled:opacity-50"
              />
              {errors.lastName && (
                <p className="text-[11px] text-red-400 mt-0.5">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-neutral-400">Email Address</label>
            <input
              type="email"
              placeholder="john.doe@example.com"
              disabled={loading || success}
              {...register("email")}
              className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 rounded-lg px-3 py-2 outline-none focus:border-indigo-600 transition-colors text-sm disabled:opacity-50"
            />
            {errors.email && (
              <p className="text-[11px] text-red-400 mt-0.5">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-neutral-400">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              disabled={loading || success}
              {...register("password")}
              className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 rounded-lg px-3 py-2 outline-none focus:border-indigo-600 transition-colors text-sm disabled:opacity-50"
            />
            {errors.password && (
              <p className="text-[11px] text-red-400 mt-0.5">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 cursor-pointer text-sm"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <span>Sign Up</span>
            )}
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="mt-6 text-center text-xs text-neutral-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors underline cursor-pointer"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
