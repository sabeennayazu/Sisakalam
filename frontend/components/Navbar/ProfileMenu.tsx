export default function ProfileMenu() {
  return (
    <div className="absolute right-0 top-full pt-4">
      <div className="relative bg-white shadow-xl rounded-xl w-44 p-3">

        <div className="absolute -top-2 right-4 w-4 h-4 bg-white rotate-45"></div>

        <ul className="space-y-2 text-sm">
          <li className="hover:text-blue-600 cursor-pointer">
            Profile
          </li>
          <li className="hover:text-blue-600 cursor-pointer">
            Settings
          </li>
          <li className="hover:text-red-500 cursor-pointer">
            Logout
          </li>
        </ul>

      </div>
    </div>
  );
}