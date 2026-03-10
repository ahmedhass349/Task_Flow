export function TaskFlowLogo() {
  return (
    <div className="flex items-center gap-[8px] h-[40px]">
      {/* Icon */}
      <div className="relative w-[40px] h-[40px]">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path
            d="M20 0C8.954 0 0 8.954 0 20s8.954 20 20 20 20-8.954 20-20S31.046 0 20 0z"
            fill="#3B82F6"
          />
          <path
            d="M28 14l-2-2-8 8-4-4-2 2 6 6 10-10z"
            fill="white"
          />
        </svg>
      </div>
      {/* Text */}
      <span className="font-['Roboto',sans-serif] font-bold text-[22px] text-black tracking-[0.15px] whitespace-nowrap">
        TaskFlow <span className="font-normal">Pro</span>
      </span>
    </div>
  );
}