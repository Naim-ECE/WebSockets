import { useEffect } from "react";
import useConversationStore from "../../store/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { IoChatbubblesOutline, IoArrowBack } from "react-icons/io5";
import { useAuthContext } from "../../context/AuthContext";

const MessageContainer = () => {
  const { selectedConversation, setSelectedConversation } =
    useConversationStore();
  const { authUser } = useAuthContext();

  useEffect(() => {
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-black/20 backdrop-blur-md">
      {!selectedConversation ? (
        <NoChatSelected username={authUser?.username} />
      ) : (
        <>
          {/* Header with Mobile Back Button */}
          <div className="flex items-center bg-gray-800/80 px-4 py-3 border-b border-gray-700 shadow-sm">
            <button
              className="md:hidden mr-3 text-gray-300 hover:text-white transition-all active:scale-90"
              onClick={() => setSelectedConversation(null)}
            >
              <IoArrowBack className="text-xl" />
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden mr-3 border border-gray-600">
              <img src={selectedConversation.profilePicture} alt="avatar" />
            </div>
            <div>
              <span className="text-gray-400 text-xs block">To:</span>
              <span className="text-white font-bold">
                {selectedConversation.fullName}
              </span>
            </div>
          </div>

          <Messages />
          <MessageInput />
        </>
      )}
    </div>
  );
};

export default MessageContainer;

const NoChatSelected = ({ username }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-center px-4">
      <div className="flex flex-wrap justify-center items-center gap-2 text-2xl font-semibold text-white tracking-wide">
        <span>Welcome 👋</span>
        <span className="text-blue-400">{username || "User"}</span>
      </div>
      <p className="mt-2 text-sm text-gray-400 font-medium">
        Select a chat to start messaging
      </p>
      <IoChatbubblesOutline className="mt-6 text-7xl text-gray-600 animate-pulse" />
    </div>
  );
};
