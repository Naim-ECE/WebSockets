import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";

const Sidebar = () => {
  return (
    <div className="flex flex-col h-full p-3 bg-gray-900/50">
      <SearchInput />

      {/* Glowing Divider */}
      <div className="group flex items-center justify-center w-full my-4 cursor-pointer">
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-gray-600 to-gray-500 transition-all duration-300 group-hover:via-blue-500 group-hover:shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
        <div className="mx-2 w-2 h-2 rotate-45 bg-gray-500 transition-all duration-300 group-hover:bg-blue-400 group-hover:shadow-[0_0_10px_rgba(59,130,246,1)] group-hover:scale-125" />
        <div className="h-px flex-1 bg-linear-to-l from-transparent via-gray-600 to-gray-500 transition-all duration-300 group-hover:via-blue-500 group-hover:shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
      </div>

      <div className="flex-1 overflow-hidden">
        <Conversations />
      </div>
      <div className="divider px-2 my-1"></div>
      <LogoutButton />
    </div>
  );
};

export default Sidebar;
