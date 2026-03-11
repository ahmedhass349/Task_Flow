import { Search, Plus, Bell, HelpCircle, Grid, User, Settings, Palette, LogOut, UserCircle, ChevronRight } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export default function Header() {
  return (
    <header className="bg-black border-b border-gray-800 h-14 flex items-center px-6 justify-between">
      {/* Left spacer for centering */}
      <div className="flex-1" />

      {/* Centered Search */}
      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks, projects, people..."
            className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg bg-gray-900 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-1 justify-end">
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          <Plus className="size-4" />
          <span>Create</span>
        </button>
        
        <button className="p-2 text-gray-400 hover:bg-gray-800 rounded-lg transition-colors">
          <Grid className="size-5" />
        </button>
        
        <button className="p-2 text-gray-400 hover:bg-gray-800 rounded-lg transition-colors">
          <Bell className="size-5" />
        </button>
        
        <button className="p-2 text-gray-400 hover:bg-gray-800 rounded-lg transition-colors">
          <HelpCircle className="size-5" />
        </button>

        {/* User Avatar with Dropdown */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="ml-2 size-8 bg-teal-600 rounded-full flex items-center justify-center hover:bg-teal-700 transition-colors cursor-pointer border-0 outline-none">
            <span className="text-white text-sm font-semibold">AA</span>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="bg-white border border-gray-200 rounded-lg shadow-lg p-2 w-64 z-50"
              sideOffset={5}
              align="end"
            >
              {/* User Info Header */}
              <div className="flex items-center gap-3 px-3 py-3 border-b border-gray-200 mb-2">
                <div className="size-10 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold">AA</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">Ahmed Abdelbarr</p>
                  <p className="text-sm text-gray-600 truncate">ahmedhass349@gmail.com</p>
                </div>
              </div>

              {/* Menu Items */}
              <DropdownMenu.Item className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer outline-none">
                <User className="size-4" />
                <span className="text-sm">Profile</span>
              </DropdownMenu.Item>

              <DropdownMenu.Item className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer outline-none">
                <Settings className="size-4" />
                <span className="text-sm">Account settings</span>
              </DropdownMenu.Item>

              <DropdownMenu.Sub>
                <DropdownMenu.SubTrigger className="flex items-center justify-between gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer outline-none">
                  <div className="flex items-center gap-3">
                    <Palette className="size-4" />
                    <span className="text-sm">Theme</span>
                  </div>
                  <ChevronRight className="size-4" />
                </DropdownMenu.SubTrigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.SubContent
                    className="bg-white border border-gray-200 rounded-lg shadow-lg p-2 w-48 z-50"
                    sideOffset={8}
                  >
                    <DropdownMenu.Item className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer outline-none">
                      Light
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer outline-none">
                      Dark
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer outline-none">
                      System
                    </DropdownMenu.Item>
                  </DropdownMenu.SubContent>
                </DropdownMenu.Portal>
              </DropdownMenu.Sub>

              <DropdownMenu.Separator className="h-px bg-gray-200 my-2" />

              <DropdownMenu.Item className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer outline-none">
                <UserCircle className="size-4" />
                <span className="text-sm">Switch account</span>
              </DropdownMenu.Item>

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
