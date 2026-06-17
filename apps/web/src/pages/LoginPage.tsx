import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
// Styled using flat basic style

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setApiError(null);
    try {
      await login(data.email, data.password);
    } catch (err) {
      setApiError((err as Error).message || "Login failed. Check your credentials.");
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
          <h2 className="text-xl font-bold text-neutral-100">Welcome back</h2>
          <p className="text-xs text-neutral-400">Log in to manage directory users</p>
        </div>

        {/* Alerts */}
        {apiError && (
          <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-450">
            <p>{apiError}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Email Address */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-neutral-400">
              Email Address
            </label>
            <input
              type="email"
              placeholder="john.doe@example.com"
              disabled={loading}
              {...register("email")}
              className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 rounded-lg px-3 py-2 outline-none focus:border-indigo-600 transition-colors text-sm disabled:opacity-50"
            />
            {errors.email && (
              <p className="text-[11px] text-red-400 mt-0.5">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-neutral-400">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              disabled={loading}
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
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 cursor-pointer text-sm"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="mt-6 text-center text-xs text-neutral-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors underline cursor-pointer"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
