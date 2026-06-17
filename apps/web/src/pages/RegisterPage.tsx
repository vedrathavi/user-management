import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Lock, ShieldAlert, CheckCircle2, ChevronRight, UserPlus } from "lucide-react";

const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface Props {
  onToggleView: () => void;
}

const RegisterPage = ({ onToggleView }: Props) => {
  const { register: signup } = useAuth();
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
        onToggleView();
      }, 2000);
    } catch (err) {
      setApiError((err as Error).message || "Registration failed. Try again.");
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
      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-neutral-800 bg-neutral-900/20 backdrop-blur-xl p-8 md:p-10 shadow-2xl">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-2 mb-8">
          <div className="rounded-2xl bg-indigo-500/10 p-4 text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
            <UserPlus size={28} />
          </div>
          <h2 className="text-2xl font-bold text-neutral-100 tracking-tight">Create an account</h2>
          <p className="text-sm text-neutral-400">Join the user management directory</p>
        </div>

        {/* Alerts */}
        {apiError && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
            <ShieldAlert size={18} className="mt-0.5 shrink-0" />
            <p>{apiError}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-green-500/20 bg-green-500/5 p-4 text-sm text-green-400">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
            <p>Registration successful! Redirecting to login...</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
                <User size={12} />
                <span>First Name</span>
              </label>
              <input
                type="text"
                placeholder="John"
                disabled={loading || success}
                {...register("firstName")}
                className="w-full bg-neutral-950/60 border border-neutral-800 text-neutral-100 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500/50 transition-all duration-150 text-sm disabled:opacity-50"
              />
              {errors.firstName && (
                <p className="text-[11px] text-red-400 mt-0.5">{errors.firstName.message}</p>
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
                disabled={loading || success}
                {...register("lastName")}
                className="w-full bg-neutral-950/60 border border-neutral-800 text-neutral-100 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500/50 transition-all duration-150 text-sm disabled:opacity-50"
              />
              {errors.lastName && (
                <p className="text-[11px] text-red-400 mt-0.5">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
              <Mail size={12} />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              placeholder="john.doe@example.com"
              disabled={loading || success}
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
              disabled={loading || success}
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
            disabled={loading || success}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:scale-100 cursor-pointer"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <span>Sign Up</span>
                <ChevronRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="mt-8 text-center text-xs text-neutral-400">
          Already have an account?{" "}
          <button
            onClick={onToggleView}
            className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-4 cursor-pointer"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
