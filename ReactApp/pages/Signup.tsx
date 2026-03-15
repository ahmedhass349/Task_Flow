import { useState } from "react";
import { useNavigate, Navigate } from "react-router";
import { TaskFlowLogo } from "../Components/TaskFlowLogo";
import { AuthFooter } from "../Components/AuthFooter";
import { useAuth } from "../context/AuthContext";

// ── Validation helpers ───────────────────────────────────────────────────

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  company: string;
  country: string;
  phone: string;
  timezone: string;
}

function validateSignupForm(data: SignupFormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.firstName.trim()) {
    errors.firstName = "First name is required";
  }

  if (!data.lastName.trim()) {
    errors.lastName = "Last name is required";
  }

  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!data.password) {
    errors.password = "Password is required";
  } else if (data.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (!data.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (data.password && data.confirmPassword !== data.password) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}

// ── Component ────────────────────────────────────────────────────────────

export default function Signup() {
  const navigate = useNavigate();
  const { signup, isAuthenticated, error: authError, clearError } = useAuth();

  const [formData, setFormData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
    country: "United States",
    phone: "+20",
    timezone: "GMT+2",
  });
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field error on change
    if (name in fieldErrors) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    // Client-side validation
    const errors = validateSignupForm(formData);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    try {
      await signup({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      navigate("/", { replace: true });
    } catch {
      // Error is already set in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper: border class based on whether a field has an error
  const borderClass = (field: keyof FormErrors) =>
    fieldErrors[field]
      ? "border-red-500"
      : "border-[rgba(0,0,0,0.23)]";

  const ringClass = (field: keyof FormErrors) =>
    fieldErrors[field] ? "ring-1 ring-red-500" : "";

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Signup Form */}
      <div className="flex-1 flex flex-col min-h-screen relative">
        {/* Logo */}
        <div className="pt-[54px] pl-[55px]">
          <TaskFlowLogo />
        </div>

        {/* Form */}
        <div className="flex-1 flex flex-col justify-center pl-[99px] pr-[40px]">
          <h1 className="font-medium text-[20px] leading-[1.6] text-foreground tracking-[0.15px] mb-[40px]">
            Sign up to TaskFlow Pro
          </h1>

          {/* Server error banner */}
          {authError && (
            <div className="mb-[24px] max-w-[462px] rounded-[4px] border border-red-300 bg-red-50 px-[12px] py-[10px]">
              <p className="text-sm text-red-700">
                {authError}
              </p>
            </div>
          )}

          <form onSubmit={handleSignup} noValidate className="max-w-[462px]">
            {/* First and Last Name */}
            <div className="flex gap-[22px] mb-[24px]">
              {/* First Name */}
              <div className="flex-1">
                <div className={`relative rounded-[4px] ${ringClass("firstName")}`}>
                  <div
                    aria-hidden="true"
                    className={`absolute border border-solid inset-0 pointer-events-none rounded-[4px] ${borderClass("firstName")}`}
                  />
                  <div className="px-[12px]">
                    <input
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First name *"
                      aria-label="First name"
                      className="w-full py-4 bg-transparent font-normal text-base text-foreground tracking-[0.15px] leading-6 outline-none placeholder:text-muted-foreground"
                      aria-invalid={!!fieldErrors.firstName}
                      aria-describedby={fieldErrors.firstName ? "firstName-error" : undefined}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                {fieldErrors.firstName && (
                  <p id="firstName-error" className="mt-1 text-xs text-red-600 pl-0.5">
                    {fieldErrors.firstName}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="flex-1">
                <div className={`relative rounded-[4px] ${ringClass("lastName")}`}>
                  <div
                    aria-hidden="true"
                    className={`absolute border border-solid inset-0 pointer-events-none rounded-[4px] ${borderClass("lastName")}`}
                  />
                  <div className="px-[12px]">
                    <input
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last name *"
                      aria-label="Last name"
                      className="w-full py-4 bg-transparent font-normal text-base text-foreground tracking-[0.15px] leading-6 outline-none placeholder:text-muted-foreground"
                      aria-invalid={!!fieldErrors.lastName}
                      aria-describedby={fieldErrors.lastName ? "lastName-error" : undefined}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                {fieldErrors.lastName && (
                  <p id="lastName-error" className="mt-1 text-xs text-red-600 pl-0.5">
                    {fieldErrors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="mb-[24px]">
              <div className={`relative rounded-[4px] w-full ${ringClass("email")}`}>
                <div
                  aria-hidden="true"
                  className={`absolute border border-solid inset-0 pointer-events-none rounded-[4px] ${borderClass("email")}`}
                />
                <div className="px-[12px] relative">
                  {formData.email && (
                    <div className="bg-white flex h-[2px] items-center px-[4px] absolute top-0 left-[8px]">
                      <span className="font-normal text-xs text-muted-foreground tracking-[0.15px] leading-3">
                        Email Address
                      </span>
                    </div>
                  )}
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address *"
                    aria-label="Email Address"
                    className="w-full py-[15px] bg-transparent font-normal text-base text-foreground tracking-[0.15px] leading-6 outline-none placeholder:text-muted-foreground"
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
              <div className={`relative rounded-[4px] w-full ${ringClass("password")}`}>
                <div
                  aria-hidden="true"
                  className={`absolute border border-solid inset-0 pointer-events-none rounded-[4px] ${borderClass("password")}`}
                />
                <div className="px-[12px] relative">
                  {formData.password && (
                    <div className="bg-white flex h-[2px] items-center px-[4px] absolute top-0 left-[8px]">
                      <span className="font-normal text-xs text-muted-foreground tracking-[0.15px] leading-3">
                        Password
                      </span>
                    </div>
                  )}
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password *"
                    aria-label="Password"
                    className="w-full py-[15px] bg-transparent font-normal text-base text-foreground tracking-[0.15px] leading-6 outline-none placeholder:text-muted-foreground"
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

            {/* Confirm Password */}
            <div className="mb-[24px]">
              <div className={`relative rounded-[4px] w-full ${ringClass("confirmPassword")}`}>
                <div
                  aria-hidden="true"
                  className={`absolute border border-solid inset-0 pointer-events-none rounded-[4px] ${borderClass("confirmPassword")}`}
                />
                <div className="px-[12px] relative">
                  {formData.confirmPassword && (
                    <div className="bg-white flex h-[2px] items-center px-[4px] absolute top-0 left-[8px]">
                      <span className="font-normal text-xs text-muted-foreground tracking-[0.15px] leading-3">
                        Confirm Password
                      </span>
                    </div>
                  )}
                  <input
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password *"
                    aria-label="Confirm Password"
                    className="w-full py-[15px] bg-transparent font-normal text-base text-foreground tracking-[0.15px] leading-6 outline-none placeholder:text-muted-foreground"
                    aria-invalid={!!fieldErrors.confirmPassword}
                    aria-describedby={fieldErrors.confirmPassword ? "confirmPassword-error" : undefined}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              {fieldErrors.confirmPassword && (
                <p id="confirmPassword-error" className="mt-1 text-xs text-red-600 pl-0.5">
                  {fieldErrors.confirmPassword}
                </p>
              )}
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
                    <span className="font-normal text-xs text-[#92929d] tracking-[0.15px] leading-3">
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
                  aria-label="Company name"
                  className="w-full py-[15px] bg-transparent font-normal text-base text-foreground tracking-[0.15px] leading-6 outline-none placeholder:text-muted-foreground"
                  disabled={isSubmitting}
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
                    <span className="font-normal text-xs text-muted-foreground tracking-[0.15px] leading-3">
                      Country
                    </span>
                  </div>
                  <div className="flex items-center">
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      aria-label="Country"
                      className="w-full py-[15px] bg-transparent font-normal text-base text-foreground tracking-[0.15px] leading-6 outline-none appearance-none cursor-pointer"
                      disabled={isSubmitting}
                    >
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>Canada</option>
                      <option>Australia</option>
                      <option>Germany</option>
                      <option>Egypt</option>
                    </select>
                    <svg
                      aria-hidden="true"
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
                    <span className="font-normal text-xs text-[#92929d] tracking-[0.15px] leading-3">
                      Phone #
                    </span>
                  </div>
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone #"
                    aria-label="Phone number"
                    className="w-full py-[15px] bg-transparent font-normal text-base text-foreground tracking-[0.15px] leading-6 outline-none placeholder:text-muted-foreground"
                    disabled={isSubmitting}
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
                  <span className="font-normal text-xs text-muted-foreground tracking-[0.15px] leading-3">
                    Default timezone
                  </span>
                </div>
                <div className="flex items-center">
                   <select
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleChange}
                    aria-label="Default timezone"
                    className="w-full py-[15px] bg-transparent font-normal text-base text-foreground tracking-[0.15px] leading-6 outline-none appearance-none cursor-pointer"
                    disabled={isSubmitting}
                  >
                    <option>GMT-5</option>
                    <option>GMT-4</option>
                    <option>GMT+0</option>
                    <option>GMT+1</option>
                    <option>GMT+2</option>
                    <option>GMT+3</option>
                  </select>
                   <svg
                    aria-hidden="true"
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
              disabled={isSubmitting}
              className="w-full bg-brand text-white rounded-[4px] px-[22px] py-[8px] shadow-[0px_3px_1px_-2px_rgba(0,0,0,0.2),0px_2px_2px_0px_rgba(0,0,0,0.14),0px_1px_5px_0px_rgba(0,0,0,0.12)] cursor-pointer hover:bg-brand-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed mb-[16px] flex items-center justify-center gap-[8px]"
            >
                <span className="font-medium text-[15px] leading-[26px] tracking-[0.46px] uppercase text-white">
                {isSubmitting ? "Creating account..." : "Sign up"}
              </span>
              {isSubmitting && (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
            </button>

            {/* Back to Login Button */}
            <button
              type="button"
              onClick={() => navigate("/login")}
              disabled={isSubmitting}
              className="w-full bg-black text-white rounded-[4px] px-[22px] py-[8px] shadow-[0px_3px_1px_-2px_rgba(0,0,0,0.2),0px_2px_2px_0px_rgba(0,0,0,0.14),0px_1px_5px_0px_rgba(0,0,0,0.12)] cursor-pointer hover:bg-[#333] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="font-medium text-[15px] leading-[26px] tracking-[0.46px] uppercase text-white">
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
          <span className="font-bold text-lg text-white/80 tracking-[0.15px]">
            TaskFlow <span className="font-normal">Pro</span>
          </span>
        </div>
      </div>
    </div>
  );
}
