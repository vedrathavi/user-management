import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, ShieldAlert, LogIn, ChevronRight } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface Props {
  onToggleView: () => void;
}

const LoginPage = ({ onToggleView }: Props) => {
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
    <div className="relative min-h-screen w-full flex items-center justify-center bg-neutral-950 p-4 overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Card Container */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-neutral-800 bg-neutral-900/20 backdrop-blur-xl p-8 md:p-10 shadow-2xl">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-2 mb-8">
          <div className="rounded-2xl bg-indigo-500/10 p-4 text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
            <LogIn size={28} />
          </div>
          <h2 className="text-2xl font-bold text-neutral-100 tracking-tight">Welcome back</h2>
          <p className="text-sm text-neutral-400">Log in to manage directory users</p>
        </div>

        {/* Alerts */}
        {apiError && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
            <ShieldAlert size={18} className="mt-0.5 shrink-0" />
            <p>{apiError}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Email Address */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
              <Mail size={12} />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              placeholder="john.doe@example.com"
              disabled={loading}
              {...register("email")}
              className="w-full bg-neutral-950/60 border border-neutral-800 text-neutral-100 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500/50 transition-all duration-150 text-sm disabled:opacity-50"
            />
            {errors.email && (
              <p className="text-[11px] text-red-400 mt-0.5">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
              <Lock size={12} />
              <span>Password</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              disabled={loading}
              {...register("password")}
              className="w-full bg-neutral-950/60 border border-neutral-800 text-neutral-100 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500/50 transition-all duration-150 text-sm disabled:opacity-50"
            />
            {errors.password && (
              <p className="text-[11px] text-red-400 mt-0.5">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:scale-100 cursor-pointer"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <span>Sign In</span>
                <ChevronRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="mt-8 text-center text-xs text-neutral-400">
          Don't have an account?{" "}
          <button
            onClick={onToggleView}
            className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-4 cursor-pointer"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
