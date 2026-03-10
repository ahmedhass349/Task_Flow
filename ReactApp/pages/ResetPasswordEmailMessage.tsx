import { useNavigate } from "react-router";
import { TaskFlowLogo } from "../Components/TaskFlowLogo";
import { AuthFooter } from "../Components/AuthFooter";

export default function ResetPasswordEmailMessage() {
  const navigate = useNavigate();

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
            Recovery Email Sent!
          </h1>
          <p className="font-['Roboto',sans-serif] font-normal text-[14px] leading-[1.43] text-[rgba(0,0,0,0.87)] tracking-[0.15px] mb-[40px]">
            Please check your email for next steps to reset your password.
          </p>

          {/* Contact Support Button */}
          <button
            type="button"
            onClick={() => {
              /* contact support action */
            }}
            className="bg-brand text-white rounded-[4px] px-[22px] py-[8px] shadow-[0px_3px_1px_-2px_rgba(0,0,0,0.2),0px_2px_2px_0px_rgba(0,0,0,0.14),0px_1px_5px_0px_rgba(0,0,0,0.12)] flex items-center gap-[8px] cursor-pointer hover:bg-brand-hover transition-colors mb-[120px]"
          >
            <span className="font-['Roboto',sans-serif] font-medium text-[15px] leading-[26px] tracking-[0.46px] uppercase text-white">
              contact Support
            </span>
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
        </div>
      </div>

      {/* Footer */}
      <div className="pb-[20px] flex justify-center">
        <AuthFooter />
      </div>
    </div>
  );
}
