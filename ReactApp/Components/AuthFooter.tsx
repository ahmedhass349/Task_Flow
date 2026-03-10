import { Link } from "react-router";

export function AuthFooter() {
  return (
    <div className="flex items-center gap-[10px] text-[14px] font-['Roboto',sans-serif] font-normal text-[rgba(0,0,0,0.87)] tracking-[0.15px]">
      <Link to="#" className="hover:underline leading-[1.43]">
        Terms and conditions
      </Link>
      <svg width="5" height="5" viewBox="0 0 5 5" fill="none" className="shrink-0">
        <circle cx="2.5" cy="2.5" r="2.5" fill="black" />
      </svg>
      <Link to="#" className="hover:underline leading-[1.43]">
        Privacy policy
      </Link>
    </div>
  );
}
