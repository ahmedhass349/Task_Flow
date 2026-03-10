import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { TaskFlowLogo } from "../Components/TaskFlowLogo";
import { AuthFooter } from "../Components/AuthFooter";
import LoginPromotion from "../imports/LoginPromotion1";
import PromotionBg from "../imports/PromotionBg";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white flex font-['Roboto',sans-serif]">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex flex-col min-h-screen relative">
        {/* Logo */}
        <div className="pt-[54px] pl-[55px]">
          <TaskFlowLogo />
        </div>

        {/* Form */}
        <div className="flex-1 flex flex-col justify-center pl-[55px] pr-[40px] max-w-[460px]">
          <h1 className="font-['Roboto',sans-serif] font-medium text-[20px] leading-[1.6] text-[rgba(0,0,0,0.87)] tracking-[0.15px] mb-[48px]">
            Sign in
          </h1>

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div className="relative rounded-[4px] w-[345px] mb-[24px]">
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
                />
              </div>
            </div>

            {/* Password */}
            <div className="relative rounded-[4px] w-[345px] mb-[24px]">
              <div
                aria-hidden="true"
                className="absolute border border-[rgba(0,0,0,0.23)] border-solid inset-0 pointer-events-none rounded-[4px]"
              />
              <div className="px-[12px]">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password *"
                  className="w-full py-[16px] bg-transparent font-['Roboto',sans-serif] font-normal text-[16px] text-[rgba(0,0,0,0.87)] tracking-[0.15px] leading-[24px] outline-none placeholder:text-[rgba(0,0,0,0.6)]"
                  required
                />
              </div>
            </div>

            {/* Login button + Forgot password row */}
            <div className="flex items-center gap-[16px] mb-[32px]">
              <button
                type="submit"
                className="bg-brand text-white rounded-[4px] px-[22px] py-[8px] shadow-[0px_3px_1px_-2px_rgba(0,0,0,0.2),0px_2px_2px_0px_rgba(0,0,0,0.14),0px_1px_5px_0px_rgba(0,0,0,0.12)] flex items-center gap-[8px] cursor-pointer hover:bg-brand-hover transition-colors"
              >
                <span className="font-['Roboto',sans-serif] font-medium text-[15px] leading-[26px] tracking-[0.46px] uppercase text-[rgba(255,255,255,0.87)]">
                  Login
                </span>
                <svg width="18" height="22" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z"
                    fill="white"
                  />
                </svg>
              </button>
              <Link
                to="/forgot-password"
                className="font-['Roboto',sans-serif] font-medium text-[14px] leading-[1.57] text-[rgba(0,0,0,0.87)] tracking-[0.1px] hover:underline"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Create New Account button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="bg-black text-white rounded-[4px] px-[22px] py-[8px] w-[344px] shadow-[0px_3px_1px_-2px_rgba(0,0,0,0.2),0px_2px_2px_0px_rgba(0,0,0,0.14),0px_1px_5px_0px_rgba(0,0,0,0.12)] cursor-pointer hover:bg-[#333] transition-colors"
              >
                <span className="font-['Roboto',sans-serif] font-medium text-[15px] leading-[26px] tracking-[0.46px] uppercase text-[rgba(255,255,255,0.87)]">
                  create new account
                </span>
              </button>
              {/* Beta badge */}
              <div className="absolute -top-[12px] right-[-8px] bg-[#b0407c] text-white font-['Roboto',sans-serif] font-medium text-[12px] leading-[20px] tracking-[0.14px] px-[6.5px] rounded-[64px] text-center">
                Beta
              </div>
            </div>
          </form>
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
