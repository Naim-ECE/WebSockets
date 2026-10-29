import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";

const Sidebar = () => {
  return (
    <div className="flex flex-col h-full p-2">
      <SearchInput />
      <div className="group flex items-center justify-center w-full my-4 cursor-pointer">
        {/* Left Line */}
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-gray-500/50 to-gray-400 transition-all duration-300 group-hover:via-gray-300 group-hover:shadow-[0_0_8px_rgba(209,213,219,0.5)]" />

        {/* Glowing Diamond */}
        <div className="mx-2 w-2.5 h-2.5 rotate-45 bg-gray-400 rounded-[1px] shadow-[0_0_8px_rgba(156,163,175,0.6)] transition-all duration-300 group-hover:bg-gray-200 group-hover:shadow-[0_0_15px_rgba(209,213,219,1)] group-hover:scale-110" />

        {/* Right Line */}
        <div className="h-px flex-1 bg-linear-to-l from-transparent via-gray-500/50 to-gray-400 transition-all duration-300 group-hover:via-gray-300 group-hover:shadow-[0_0_8px_rgba(209,213,219,0.5)]" />
      </div>
      <div className="flex-1 overflow-hidden">
        <Conversations />
      </div>
      <div className="divider px-2"></div>
      <LogoutButton />
    </div>
  );
};

export default Sidebar;
