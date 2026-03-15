export function AuthFooter() {
  return (
    <div className="flex items-center gap-2.5 text-sm font-normal text-foreground tracking-[0.15px]">
      <button type="button" className="hover:underline leading-[1.43] cursor-pointer bg-transparent border-none p-0">
        Terms and conditions
      </button>
      <svg width="5" height="5" viewBox="0 0 5 5" fill="none" className="shrink-0" aria-hidden="true">
        <circle cx="2.5" cy="2.5" r="2.5" fill="black" />
      </svg>
      <button type="button" className="hover:underline leading-[1.43] cursor-pointer bg-transparent border-none p-0">
        Privacy policy
      </button>
    </div>
  );
}
