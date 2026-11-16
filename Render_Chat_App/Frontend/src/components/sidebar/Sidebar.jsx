import { useState, useEffect } from "react";
import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";
import AddFriendModal from "../AddFriendModal"; // Import
import { FaUserPlus } from "react-icons/fa"; // Import icon
import { useSocketContext } from "../../context/SocketContext"; // Import socket
import toast from "react-hot-toast";

const Sidebar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { socket } = useSocketContext();

  // Listen for incoming friend requests globally
  useEffect(() => {
    if (!socket) return;

    socket.on("newFriendRequest", () => {
      toast.success("You have a new friend request!", { icon: "👋" });
    });

    return () => socket.off("newFriendRequest");
  }, [socket]);

  return (
    <div className="flex flex-col h-full p-3 bg-gray-900/50 relative">
      {/* Header with Search and Add Button */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1">
          <SearchInput />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 p-3 rounded-lg text-white shadow-lg transition-all active:scale-95"
          title="Add Friend"
        >
          <FaUserPlus size={18} />
        </button>
      </div>

      {/* Glowing Divider */}
      <div className="group flex items-center justify-center w-full my-2 cursor-pointer">
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-gray-600 to-gray-500 transition-all duration-300 group-hover:via-blue-500 group-hover:shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
        <div className="mx-2 w-2 h-2 rotate-45 bg-gray-500 transition-all duration-300 group-hover:bg-blue-400 group-hover:shadow-[0_0_10px_rgba(59,130,246,1)] group-hover:scale-125" />
        <div className="h-px flex-1 bg-linear-to-l from-transparent via-gray-600 to-gray-500 transition-all duration-300 group-hover:via-blue-500 group-hover:shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
      </div>

      {/* Conversation List (will now be the Friend List) */}
      <div className="flex-1 overflow-hidden">
        <Conversations />
      </div>

      <div className="divider px-2 my-1"></div>
      <LogoutButton />

      {/* The Modal */}
      <AddFriendModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Sidebar;
