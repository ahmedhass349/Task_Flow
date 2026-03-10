import { useState } from "react";
import { useNavigate } from "react-router";
import { TaskFlowLogo } from "../components/TaskFlowLogo";
import { AuthFooter } from "../components/AuthFooter";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    country: "United States",
    phone: "+20",
    timezone: "GMT+2",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white flex font-['Roboto',sans-serif]">
      {/* Left Side - Signup Form */}
      <div className="flex-1 flex flex-col min-h-screen relative">
        {/* Logo */}
        <div className="pt-[54px] pl-[55px]">
          <TaskFlowLogo />
        </div>

        {/* Form */}
        <div className="flex-1 flex flex-col justify-center pl-[99px] pr-[40px]">
          <h1 className="font-['Roboto',sans-serif] font-medium text-[20px] leading-[1.6] text-[rgba(0,0,0,0.87)] tracking-[0.15px] mb-[40px]">
            Sign up to TaskFlow Pro
          </h1>

          <form onSubmit={handleSignup} className="max-w-[462px]">
            {/* First and Last Name */}
            <div className="flex gap-[22px] mb-[24px]">
              <div className="relative rounded-[4px] flex-1">
                <div
                  aria-hidden="true"
                  className="absolute border border-[rgba(0,0,0,0.23)] border-solid inset-0 pointer-events-none rounded-[4px]"
                />
                <div className="px-[12px]">
                  <input
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    className="w-full py-[16px] bg-transparent font-['Roboto',sans-serif] font-normal text-[16px] text-[rgba(0,0,0,0.87)] tracking-[0.15px] leading-[24px] outline-none placeholder:text-[#92929d]"
                  />
                </div>
              </div>
              <div className="relative rounded-[4px] flex-1">
                <div
                  aria-hidden="true"
                  className="absolute border border-[rgba(0,0,0,0.23)] border-solid inset-0 pointer-events-none rounded-[4px]"
                />
                <div className="px-[12px]">
                  <input
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    className="w-full py-[16px] bg-transparent font-['Roboto',sans-serif] font-normal text-[16px] text-[rgba(0,0,0,0.87)] tracking-[0.15px] leading-[24px] outline-none placeholder:text-[#92929d]"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="relative rounded-[4px] w-full mb-[24px]">
              <div
                aria-hidden="true"
                className="absolute border border-[rgba(0,0,0,0.23)] border-solid inset-0 pointer-events-none rounded-[4px]"
              />
              <div className="px-[12px] relative">
                {formData.email && (
                  <div className="bg-white flex h-[2px] items-center px-[4px] absolute top-0 left-[8px]">
                    <span className="font-['Roboto',sans-serif] font-normal text-[12px] text-[rgba(0,0,0,0.6)] tracking-[0.15px] leading-[12px]">
                      Email Address
                    </span>
                  </div>
                )}
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full py-[15px] bg-transparent font-['Roboto',sans-serif] font-normal text-[16px] text-[rgba(0,0,0,0.87)] tracking-[0.15px] leading-[24px] outline-none placeholder:text-[rgba(0,0,0,0.6)]"
                  required
                />
              </div>
            </div>

            {/* Company Name */}
            <div className="relative rounded-[4px] w-full mb-[24px]">
              <div
                aria-hidden="true"
                className="absolute border border-[#e2e2ea] border-solid inset-0 pointer-events-none rounded-[4px]"
              />
              <div className="px-[12px] relative">
                {formData.company && (
                  <div className="bg-white flex h-[2px] items-center px-[4px] absolute top-0 left-[8px]">
                    <span className="font-['Roboto',sans-serif] font-normal text-[12px] text-[#92929d] tracking-[0.15px] leading-[12px]">
                      Company name
                    </span>
                  </div>
                )}
                <input
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Company name"
                  className="w-full py-[15px] bg-transparent font-['Roboto',sans-serif] font-normal text-[16px] text-[rgba(0,0,0,0.87)] tracking-[0.15px] leading-[24px] outline-none placeholder:text-[#92929d]"
                />
              </div>
            </div>

            {/* Country and Phone */}
            <div className="flex gap-[22px] mb-[24px]">
              <div className="relative rounded-[4px] flex-1">
                <div
                  aria-hidden="true"
                  className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[4px]"
                />
                <div className="px-[12px] relative">
                  <div className="bg-white flex h-[2px] items-center px-[4px] absolute top-0 left-[8px]">
                    <span className="font-['Roboto',sans-serif] font-normal text-[12px] text-[rgba(0,0,0,0.6)] tracking-[0.15px] leading-[12px]">
                      Country
                    </span>
                  </div>
                  <div className="flex items-center">
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full py-[15px] bg-transparent font-['Roboto',sans-serif] font-normal text-[16px] text-[rgba(0,0,0,0.87)] tracking-[0.15px] leading-[24px] outline-none appearance-none cursor-pointer"
                    >
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>Canada</option>
                      <option>Australia</option>
                      <option>Germany</option>
                      <option>Egypt</option>
                    </select>
                    <svg
                      width="10"
                      height="5"
                      viewBox="0 0 10 5"
                      fill="none"
                      className="shrink-0 pointer-events-none"
                    >
                      <path d="M0 0L5 5L10 0H0Z" fill="rgba(0,0,0,0.54)" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="relative rounded-[4px] flex-1">
                <div
                  aria-hidden="true"
                  className="absolute border border-[#e2e2ea] border-solid inset-0 pointer-events-none rounded-[4px]"
                />
                <div className="px-[12px] relative">
                  <div className="bg-white flex h-[2px] items-center px-[4px] absolute top-0 left-[8px]">
                    <span className="font-['Roboto',sans-serif] font-normal text-[12px] text-[#92929d] tracking-[0.15px] leading-[12px]">
                      Phone #
                    </span>
                  </div>
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone #"
                    className="w-full py-[15px] bg-transparent font-['Roboto',sans-serif] font-normal text-[16px] text-[rgba(0,0,0,0.87)] tracking-[0.15px] leading-[24px] outline-none placeholder:text-[#92929d]"
                  />
                </div>
              </div>
            </div>

            {/* Default Timezone */}
            <div className="relative rounded-[4px] w-full mb-[32px]">
              <div
                aria-hidden="true"
                className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[4px]"
              />
              <div className="px-[12px] relative">
                <div className="bg-white flex h-[2px] items-center px-[4px] absolute top-0 left-[8px]">
                  <span className="font-['Roboto',sans-serif] font-normal text-[12px] text-[rgba(0,0,0,0.6)] tracking-[0.15px] leading-[12px]">
                    Default timezone
                  </span>
                </div>
                <div className="flex items-center">
                  <select
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleChange}
                    className="w-full py-[15px] bg-transparent font-['Roboto',sans-serif] font-normal text-[16px] text-[rgba(0,0,0,0.87)] tracking-[0.15px] leading-[24px] outline-none appearance-none cursor-pointer"
                  >
                    <option>GMT-5</option>
                    <option>GMT-4</option>
                    <option>GMT+0</option>
                    <option>GMT+1</option>
                    <option>GMT+2</option>
                    <option>GMT+3</option>
                  </select>
                  <svg
                    width="10"
                    height="5"
                    viewBox="0 0 10 5"
                    fill="none"
                    className="shrink-0 pointer-events-none"
                  >
                    <path d="M0 0L5 5L10 0H0Z" fill="#92929D" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full bg-brand text-white rounded-[4px] px-[22px] py-[8px] shadow-[0px_3px_1px_-2px_rgba(0,0,0,0.2),0px_2px_2px_0px_rgba(0,0,0,0.14),0px_1px_5px_0px_rgba(0,0,0,0.12)] cursor-pointer hover:bg-brand-hover transition-colors mb-[16px]"
            >
              <span className="font-['Roboto',sans-serif] font-medium text-[15px] leading-[26px] tracking-[0.46px] uppercase text-white">
                Sign up
              </span>
            </button>

            {/* Back to Login Button */}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full bg-black text-white rounded-[4px] px-[22px] py-[8px] shadow-[0px_3px_1px_-2px_rgba(0,0,0,0.2),0px_2px_2px_0px_rgba(0,0,0,0.14),0px_1px_5px_0px_rgba(0,0,0,0.12)] cursor-pointer hover:bg-[#333] transition-colors"
            >
              <span className="font-['Roboto',sans-serif] font-medium text-[15px] leading-[26px] tracking-[0.46px] uppercase text-white">
                BACK to login
              </span>
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="pb-[20px] pl-[99px]">
          <AuthFooter />
        </div>
      </div>

      {/* Right Side - Blue Promotion Panel */}
      <div className="hidden lg:block w-[37.5%] bg-brand min-h-screen relative">
        {/* Decorative white text/shapes - subtle branding */}
        <div className="absolute bottom-[30px] right-[30px]">
          <span className="font-['Roboto',sans-serif] font-bold text-[18px] text-white/80 tracking-[0.15px]">
            TaskFlow <span className="font-normal">Pro</span>
          </span>
        </div>
      </div>
    </div>
  );
}