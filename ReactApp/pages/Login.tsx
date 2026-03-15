import { useState } from "react";
import { Link, useNavigate, useLocation, Navigate } from "react-router";
import { TaskFlowLogo } from "../Components/TaskFlowLogo";
import { AuthFooter } from "../Components/AuthFooter";
import LoginPromotion from "../imports/LoginPromotion1";
import PromotionBg from "../imports/PromotionBg";
import { useAuth } from "../context/AuthContext";

// ── Validation helpers ───────────────────────────────────────────────────

interface FormErrors {
  email?: string;
  password?: string;
}

function validateLoginForm(email: string, password: string): FormErrors {
  const errors: FormErrors = {};

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
}

// ── Component ────────────────────────────────────────────────────────────

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, error: authError, clearError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    // Client-side validation
    const errors = validateLoginForm(email, password);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    try {
      await login({ email, password });
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch {
      // Error is already set in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex flex-col min-h-screen relative">
        {/* Logo */}
        <div className="pt-[54px] pl-[55px]">
          <TaskFlowLogo />
        </div>

        {/* Form */}
        <div className="flex-1 flex flex-col justify-center px-8 mx-auto w-full max-w-[460px] mt-[-200px]">
          <div className="w-[345px]">
          <h1 className="font-medium text-[20px] leading-[1.6] text-foreground tracking-[0.15px] mb-[48px] text-center">
            Sign in
          </h1>

          {/* Server error banner */}
          {authError && (
            <div className="mb-[24px] rounded-[4px] border border-red-300 bg-red-50 px-[12px] py-[10px]">
              <p className="text-[14px] text-red-700">{authError}</p>
            </div>
          )}

          <form onSubmit={handleLogin} noValidate>
            {/* Email */}
            <div className="mb-[24px]">
              <div className={`relative rounded-[4px] w-[345px] ${fieldErrors.email ? "ring-1 ring-red-500" : ""}`}>
                <div
                  aria-hidden="true"
                  className={`absolute border border-solid inset-0 pointer-events-none rounded-[4px] ${
                    fieldErrors.email ? "border-red-500" : "border-[rgba(0,0,0,0.23)]"
                  }`}
                />
                <div className="px-[12px]">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    placeholder="Email Address *"
                    aria-label="Email Address"
                    className="w-full py-[16px] bg-transparent font-normal text-base text-foreground tracking-[0.15px] leading-6 outline-none placeholder:text-muted-foreground"
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={fieldErrors.email ? "email-error" : undefined}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              {fieldErrors.email && (
                <p id="email-error" className="mt-1 text-xs text-red-600 pl-0.5">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="mb-[24px]">
              <div className={`relative rounded-[4px] w-[345px] ${fieldErrors.password ? "ring-1 ring-red-500" : ""}`}>
                <div
                  aria-hidden="true"
                  className={`absolute border border-solid inset-0 pointer-events-none rounded-[4px] ${
                    fieldErrors.password ? "border-red-500" : "border-[rgba(0,0,0,0.23)]"
                  }`}
                />
                <div className="px-[12px]">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    placeholder="Password *"
                    aria-label="Password"
                    className="w-full py-[16px] bg-transparent font-normal text-base text-foreground tracking-[0.15px] leading-6 outline-none placeholder:text-muted-foreground"
                    aria-invalid={!!fieldErrors.password}
                    aria-describedby={fieldErrors.password ? "password-error" : undefined}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              {fieldErrors.password && (
                <p id="password-error" className="mt-1 text-xs text-red-600 pl-0.5">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Login button + Forgot password row */}
            <div className="flex items-center gap-[16px] mb-[32px]">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-brand text-white rounded-[4px] px-[22px] py-[8px] shadow-[0px_3px_1px_-2px_rgba(0,0,0,0.2),0px_2px_2px_0px_rgba(0,0,0,0.14),0px_1px_5px_0px_rgba(0,0,0,0.12)] flex items-center gap-[8px] cursor-pointer hover:bg-brand-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span className="font-medium text-[15px] leading-[26px] tracking-[0.46px] uppercase text-white/87">
                  {isSubmitting ? "Signing in..." : "Login"}
                </span>
                {!isSubmitting && (
                  <svg aria-hidden="true" width="18" height="22" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z"
                      fill="white"
                    />
                  </svg>
                )}
                {isSubmitting && (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
              </button>
              <Link
                to="/forgot-password"
                className="font-medium text-sm leading-[1.57] text-foreground tracking-[0.1px] hover:underline"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Create New Account button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => navigate("/signup")}
                disabled={isSubmitting}
                className="bg-black text-white rounded-[4px] px-[22px] py-[8px] w-[344px] shadow-[0px_3px_1px_-2px_rgba(0,0,0,0.2),0px_2px_2px_0px_rgba(0,0,0,0.14),0px_1px_5px_0px_rgba(0,0,0,0.12)] cursor-pointer hover:bg-[#333] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span className="font-medium text-[15px] leading-[26px] tracking-[0.46px] uppercase text-white/87">
                  create new account
                </span>
              </button>
              {/* Beta badge */}
              <div className="absolute -top-[12px] right-[-8px] bg-[#b0407c] text-white font-medium text-xs leading-[20px] tracking-[0.14px] px-[6.5px] rounded-[64px] text-center">
                Beta
              </div>
            </div>
          </form>
          </div>
        </div>

        {/* Footer */}
        <div className="pb-[20px] pl-[55px]">
          <AuthFooter />
        </div>
      </div>

      {/* Right Side - Promotion */}
      <div className="hidden lg:block w-[58%] relative min-h-screen">
        <div className="absolute inset-0 overflow-hidden">
          <PromotionBg />
        </div>
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <div className="relative w-[468px] h-[469px]">
            <LoginPromotion />
          </div>
        </div>
      </div>
    </div>
  );
}
