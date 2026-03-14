import { useState } from "react";
import { useNavigate } from "react-router";
import { TaskFlowLogo } from "../Components/TaskFlowLogo";
import { AuthFooter } from "../Components/AuthFooter";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Request failed. Please try again.");
      }
      navigate("/reset-password-sent", { state: { email, code: data.data } });
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-['Roboto',sans-serif]">
      {/* Logo */}
      <div className="pt-[54px] pl-[55px]">
        <TaskFlowLogo />
      </div>

      {/* Centered Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-[345px]">
          <h1 className="font-['Roboto',sans-serif] font-medium text-[20px] leading-[1.6] text-[rgba(0,0,0,0.87)] tracking-[0.15px] mb-[8px]">
            Reset your password
          </h1>
          <p className="font-['Roboto',sans-serif] font-normal text-[14px] leading-[1.43] text-[rgba(0,0,0,0.87)] tracking-[0.15px] mb-[48px]">
            Type in your registered email address to receive a recovery code
          </p>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="relative rounded-[4px] w-full mb-[24px]">
              <div
                aria-hidden="true"
                className="absolute border border-[rgba(0,0,0,0.23)] border-solid inset-0 pointer-events-none rounded-[4px]"
              />
              <div className="px-[12px]">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address *"
                  className="w-full py-[16px] bg-transparent font-['Roboto',sans-serif] font-normal text-[16px] text-[rgba(0,0,0,0.87)] tracking-[0.15px] leading-[24px] outline-none placeholder:text-[rgba(0,0,0,0.6)]"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Error message */}
            {error && (
              <p className="font-['Roboto',sans-serif] text-[13px] text-red-600 mb-[16px]">
                {error}
              </p>
            )}

            {/* Next Button */}
            <button
              type="submit"
              disabled={loading}
              className="bg-brand text-white rounded-[4px] px-[22px] py-[8px] shadow-[0px_3px_1px_-2px_rgba(0,0,0,0.2),0px_2px_2px_0px_rgba(0,0,0,0.14),0px_1px_5px_0px_rgba(0,0,0,0.12)] flex items-center gap-[8px] cursor-pointer hover:bg-brand-hover transition-colors mb-[80px] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="font-['Roboto',sans-serif] font-medium text-[15px] leading-[26px] tracking-[0.46px] uppercase text-white">
                {loading ? "Sending..." : "Next"}
              </span>
              {!loading && (
                <svg width="18" height="22" viewBox="0 0 16 16" fill="none">
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
              <span className="font-['Roboto',sans-serif] font-medium text-[15px] leading-[26px] tracking-[0.46px] uppercase text-white">
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
