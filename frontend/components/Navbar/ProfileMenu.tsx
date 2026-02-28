import { User, Settings, LogOut } from "lucide-react";

export default function ProfileMenu() {
  return (
    <div className="absolute -right-18 top-full pt-4 z-50">
      <div className="relative w-52 rounded-2xl bg-white shadow-2xl border border-gray-100 
                      animate-in fade-in zoom-in-95 duration-150">

        {/* Arrow */}
        <div className="absolute -top-2 right-6 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100"></div>

        <div className="p-2">

          {/* Profile */}
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl 
                          cursor-pointer transition-all duration-200
                          hover:bg-gray-300 hover:scale-[1.02]">
            <User size={16} strokeWidth={2.5} color="#000000" />
            <span className="text-sm text-black">Profile</span>
          </div>

          {/* Settings */}
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl 
                          cursor-pointer transition-all duration-200
                          hover:bg-gray-300 hover:scale-[1.02]">
            <Settings size={16} strokeWidth={2.5} color="#000000" />
            <span className="text-sm text-black">Settings</span>
          </div>

          {/* Divider */}
          <div className="my-2 h-px bg-gray-100"></div>

          {/* Logout */}
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl 
                          cursor-pointer transition-all duration-200
                          hover:bg-red-100 hover:text-red-500 hover:scale-[1.02]">
            <LogOut size={16} strokeWidth={2} color="#EF4444" />
            <span className="text-sm text-red-500 font-medium">Logout</span>
          </div>

        </div>
      </div>
    </div>
  );
}