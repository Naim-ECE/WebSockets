import { useSocketContext } from "../../context/SocketContext";
import useConversationStore from "../../store/useConversation";

const Conversation = ({ conversation, emoji, lastIndex }) => {
  const { selectedConversation, setSelectedConversation } =
    useConversationStore();
  const { onlineUsers } = useSocketContext();

  const isSelected = selectedConversation?._id === conversation._id;
  const isOnline = onlineUsers?.includes(conversation._id);

  return (
    <>
      <div
        // Added animate-neon class for the selected conversation
        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-300 border border-transparent mb-1
          ${isSelected ? "animate-neon bg-blue-600/20" : "hover:bg-blue-700/30 hover:border-gray-600"}
        `}
        onClick={() => setSelectedConversation(conversation)}
      >
        <div
          className={`avatar ${isOnline ? "avatar-online" : "avatar-offline"}`}
        >
          <div className="w-11 rounded-full">
            <img src={conversation.profilePicture} alt="User-Avatar" />
          </div>
        </div>
        <div className="w-full flex justify-between items-center">
          <p className="font-bold text-gray-200">{conversation.fullName}</p>
          <span className="pl-8">
            <img
              src={emoji}
              alt="emoji"
              className="w-7 h-7 rounded-full object-cover"
            />
          </span>
        </div>
      </div>
      {!lastIndex && <div className="divider my-0 py-0 h-1 opacity-50" />}
    </>
  );
};

export default Conversation;
