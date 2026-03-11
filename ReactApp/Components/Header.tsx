import { Search, Bell, Mail, User, Settings, LogOut, UserCircle } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export default function Header() {
  return (
    <header className="bg-black h-16 flex items-center px-8 gap-6">
      {/* Left spacer */}
      <div className="flex-1" />

      {/* Centered Search */}
      <div className="flex-1 max-w-[417px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4" style={{ color: '#787486' }} />
          <input
            type="text"
            placeholder="Search for report..."
            style={{
              background: '#F5F5F5',
              borderRadius: 6,
              fontFamily: 'Inter, sans-serif',
              fontSize: 14,
              color: '#787486',
            }}
            className="w-full pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Right side: icons + user pill */}
      <div className="flex-1 flex items-center justify-end gap-6">
        {/* Notification icon with red badge */}
        <button className="relative p-1">
          <Bell className="size-6 text-white" />
          <span className="absolute top-0 right-0 size-[7px] bg-[#FF1267] rounded-full" />
        </button>

        {/* Mail icon with red badge */}
        <button className="relative p-1">
          <Mail className="size-6 text-white" />
          <span className="absolute top-0 right-0 size-[7px] bg-[#FF1267] rounded-full" />
        </button>

        {/* User pill with dropdown */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger
            className="flex items-center gap-4 px-4 py-1.5 rounded-full cursor-pointer border-0 outline-none hover:opacity-90 transition-opacity"
            style={{ background: '#242424' }}
          >
            <span
              className="text-white"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 500, letterSpacing: '0.48px' }}
            >
              Demo User
            </span>
            <img
              src="https://placehold.co/32x32"
              alt="avatar"
              className="size-8 rounded-full border border-white object-cover"
            />
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="bg-white border border-gray-200 rounded-lg shadow-lg p-2 w-56 z-50"
              sideOffset={8}
              align="end"
            >
              <div className="flex items-center gap-3 px-3 py-3 border-b border-gray-200 mb-2">
                <div className="size-9 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-700 font-semibold text-sm">AA</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">Demo User</p>
                </div>
              </div>

              <DropdownMenu.Item className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer outline-none">
                <User className="size-4" />
                <span className="text-sm">Profile</span>
              </DropdownMenu.Item>

              <DropdownMenu.Item className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer outline-none">
                <Settings className="size-4" />
                <span className="text-sm">Settings</span>
              </DropdownMenu.Item>

              <DropdownMenu.Item className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer outline-none">
                <UserCircle className="size-4" />
                <span className="text-sm">Switch account</span>
              </DropdownMenu.Item>

              <DropdownMenu.Separator className="h-px bg-gray-200 my-2" />

              <DropdownMenu.Item className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer outline-none">
                <LogOut className="size-4" />
                <span className="text-sm">Log out</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
