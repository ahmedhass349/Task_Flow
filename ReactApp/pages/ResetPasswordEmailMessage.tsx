import { useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { TaskFlowLogo } from "../Components/TaskFlowLogo";
import { AuthFooter } from "../Components/AuthFooter";

interface LocationState {
  email?: string;
  code?: string;
}

export default function ResetPasswordEmailMessage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, code: receivedCode } = (location.state ?? {}) as LocationState;

  const [part1, setPart1] = useState("");
  const [part2, setPart2] = useState("");
  const [error, setError] = useState("");

  const ref1 = useRef<HTMLInputElement>(null);
  const ref2 = useRef<HTMLInputElement>(null);

  // Redirect if arrived here without going through forgot-password
  if (!email) {
    navigate("/forgot-password", { replace: true });
    return null;
  }

  const handlePart1Change = (val: string) => {
    const clean = val.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);
    setPart1(clean);
    setError("");
    if (clean.length === 4) ref2.current?.focus();
  };

  const handlePart2Change = (val: string) => {
    const clean = val.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);
    setPart2(clean);
    setError("");
  };

  // Allow backspace from part2 to jump back to part1
  const handlePart2KeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && part2 === "") {
      ref1.current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (part1.length < 4 || part2.length < 4) {
      setError("Please enter the complete 8-character recovery code.");
      return;
    }
    const enteredCode = `${part1}-${part2}`;
    navigate("/reset-password", { state: { email, token: enteredCode } });
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
            Enter recovery code
          </h1>
          <p className="font-['Roboto',sans-serif] font-normal text-[14px] leading-[1.43] text-[rgba(0,0,0,0.87)] tracking-[0.15px] mb-[32px]">
            Enter the 8-character code sent to{" "}
            <span className="font-medium">{email}</span>
          </p>

          {/* Code hint — visible in dev/demo since no real SMS/email is wired */}
          {receivedCode && (
            <div className="flex items-center gap-[8px] bg-[#F5F5F5] border border-[rgba(0,0,0,0.12)] rounded-[4px] px-[14px] py-[10px] mb-[32px]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="rgba(0,0,0,0.38)" />
              </svg>
              <span className="font-['Roboto',sans-serif] text-[13px] text-[rgba(0,0,0,0.6)]">
                Your code:&nbsp;
                <span className="font-['Roboto',monospace] font-bold tracking-[2px] text-[rgba(0,0,0,0.87)]">
                  {receivedCode}
                </span>
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* 4+4 code input */}
            <div className="flex items-center gap-[12px] mb-[24px]">
              {/* Part 1 */}
              <div className="relative rounded-[4px] flex-1">
                <div
                  aria-hidden="true"
                  className="absolute border border-[rgba(0,0,0,0.23)] border-solid inset-0 pointer-events-none rounded-[4px]"
                />
                <div className="px-[12px]">
                  <input
                    ref={ref1}
                    type="text"
                    inputMode="text"
                    autoComplete="off"
                    autoFocus
                    value={part1}
                    onChange={(e) => handlePart1Change(e.target.value)}
                    maxLength={4}
                    placeholder="XXXX"
                    className="w-full py-[16px] bg-transparent font-['Roboto',monospace] font-bold text-[20px] text-center text-[rgba(0,0,0,0.87)] tracking-[4px] leading-[24px] outline-none placeholder:text-[rgba(0,0,0,0.25)] placeholder:tracking-[4px] placeholder:font-normal"
                  />
                </div>
              </div>

              {/* Dash separator */}
              <span className="font-['Roboto',sans-serif] font-bold text-[24px] text-[rgba(0,0,0,0.38)] select-none">
                —
              </span>

              {/* Part 2 */}
              <div className="relative rounded-[4px] flex-1">
                <div
                  aria-hidden="true"
                  className="absolute border border-[rgba(0,0,0,0.23)] border-solid inset-0 pointer-events-none rounded-[4px]"
                />
                <div className="px-[12px]">
                  <input
                    ref={ref2}
                    type="text"
                    inputMode="text"
                    autoComplete="off"
                    value={part2}
                    onChange={(e) => handlePart2Change(e.target.value)}
                    onKeyDown={handlePart2KeyDown}
                    maxLength={4}
                    placeholder="XXXX"
                    className="w-full py-[16px] bg-transparent font-['Roboto',monospace] font-bold text-[20px] text-center text-[rgba(0,0,0,0.87)] tracking-[4px] leading-[24px] outline-none placeholder:text-[rgba(0,0,0,0.25)] placeholder:tracking-[4px] placeholder:font-normal"
                  />
                </div>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <p className="font-['Roboto',sans-serif] text-[13px] text-red-600 mb-[16px]">
                {error}
              </p>
            )}

            {/* Verify Button */}
            <button
              type="submit"
              className="bg-brand text-white rounded-[4px] px-[22px] py-[8px] shadow-[0px_3px_1px_-2px_rgba(0,0,0,0.2),0px_2px_2px_0px_rgba(0,0,0,0.14),0px_1px_5px_0px_rgba(0,0,0,0.12)] flex items-center gap-[8px] cursor-pointer hover:bg-brand-hover transition-colors mb-[80px]"
            >
              <span className="font-['Roboto',sans-serif] font-medium text-[15px] leading-[26px] tracking-[0.46px] uppercase text-white">
                Verify
              </span>
              <svg width="18" height="22" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z"
                  fill="white"
                />
              </svg>
            </button>

            {/* Back to Login Button */}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-[344px] bg-black text-white rounded-[4px] px-[22px] py-[8px] shadow-[0px_3px_1px_-2px_rgba(0,0,0,0.2),0px_2px_2px_0px_rgba(0,0,0,0.14),0px_1px_5px_0px_rgba(0,0,0,0.12)] cursor-pointer hover:bg-[#333] transition-colors"
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
