import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router";
import { TaskFlowLogo } from "../Components/TaskFlowLogo";
import { AuthFooter } from "../Components/AuthFooter";
import { api, ApiRequestError } from "../services/api";

interface LocationState {
  email?: string;
  token?: string;
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, token } = (location.state ?? {}) as LocationState;

  const [newPassword, setNewPassword] = useState("");
  const [retryPassword, setRetryPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if arrived here without going through the enter-code step
  if (!email || !token) {
    return <Navigate to="/forgot-password" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== retryPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      await api.post<string>("/auth/reset-password", {
        email,
        token,
        newPassword,
        confirmPassword: retryPassword,
      });
      navigate("/login");
    } catch (err: unknown) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Logo */}
      <div className="pt-[54px] pl-[55px]">
        <TaskFlowLogo />
      </div>

      {/* Centered Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-[345px]">
          <h1 className="font-medium text-[20px] leading-[1.6] text-foreground tracking-[0.15px] mb-2">
            Reset your password
          </h1>
          <p className="font-normal text-sm leading-[1.43] text-foreground tracking-[0.15px] mb-10">
            Type in your new password
          </p>

          <form onSubmit={handleSubmit}>
            {/* New Password */}
            <div className="relative rounded-[4px] w-full mb-[24px]">
              <div
                aria-hidden="true"
                className="absolute border border-[rgba(0,0,0,0.23)] border-solid inset-0 pointer-events-none rounded-[4px]"
              />
              <div className="px-[12px]">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setError(""); }}
                  placeholder="New password *"
                  aria-label="New password"
                  className="w-full py-4 bg-transparent font-normal text-base text-foreground tracking-[0.15px] leading-6 outline-none placeholder:text-muted-foreground"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Retry New Password */}
            <div className="relative rounded-[4px] w-full mb-[24px]">
              <div
                aria-hidden="true"
                className="absolute border border-[rgba(0,0,0,0.23)] border-solid inset-0 pointer-events-none rounded-[4px]"
              />
              <div className="px-[12px]">
                <input
                  type="password"
                  value={retryPassword}
                  onChange={(e) => { setRetryPassword(e.target.value); setError(""); }}
                  placeholder="Retry new password *"
                  aria-label="Confirm new password"
                  className="w-full py-4 bg-transparent font-normal text-base text-foreground tracking-[0.15px] leading-6 outline-none placeholder:text-muted-foreground"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Error message */}
            {error && (
              <p className="text-[13px] text-red-600 mb-4">
                {error}
              </p>
            )}

            {/* Reset Button */}
            <button
              type="submit"
              disabled={loading}
              className="bg-brand text-white rounded-[4px] px-[22px] py-[8px] shadow-[0px_3px_1px_-2px_rgba(0,0,0,0.2),0px_2px_2px_0px_rgba(0,0,0,0.14),0px_1px_5px_0px_rgba(0,0,0,0.12)] flex items-center gap-[8px] cursor-pointer hover:bg-brand-hover transition-colors mb-[80px] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="font-medium text-[15px] leading-[26px] tracking-[0.46px] uppercase text-white">
                {loading ? "Resetting..." : "Reset"}
              </span>
              {!loading && (
                <svg aria-hidden="true" width="18" height="22" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z"
                    fill="white"
                  />
                </svg>
              )}
            </button>

            {/* Back to Login Button */}
            <button
              type="button"
              onClick={() => navigate("/login")}
              disabled={loading}
              className="w-[344px] bg-black text-white rounded-[4px] px-[22px] py-[8px] shadow-[0px_3px_1px_-2px_rgba(0,0,0,0.2),0px_2px_2px_0px_rgba(0,0,0,0.14),0px_1px_5px_0px_rgba(0,0,0,0.12)] cursor-pointer hover:bg-[#333] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="font-medium text-[15px] leading-[26px] tracking-[0.46px] uppercase text-white">
                BACK to login
              </span>
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="pb-[20px] flex justify-center">
        <AuthFooter />
      </div>
    </div>
  );
}
