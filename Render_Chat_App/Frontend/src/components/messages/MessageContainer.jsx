import { useEffect } from "react";
import useConversationStore from "../../store/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { IoChatbubblesOutline } from "react-icons/io5";
import { useAuthContext } from "../../context/AuthContext";

const MessageContainer = () => {
  const { selectedConversation, setSelectedConversation } =
    useConversationStore();
  const { authUser } = useAuthContext();

  useEffect(() => {
    // on cleanup, reset the selected conversation to null when the component unmounts
    return () => setSelectedConversation(null);
  }, []);
  return (
    <div className="flex-1 p-2 md:min-w-112.5 flex flex-col">
      {!selectedConversation ? (
        <NoChatSelected username={authUser?.username} />
      ) : (
        <>
          {/* Header */}
          <div className="bg-slate-500 px-4 py-2 mb-2">
            <span className="label-text">To: </span>
            <span className="text-white font-bold">
              {selectedConversation.fullName}
            </span>
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
    // h-full w-full ensures it takes up the entire right side of the screen
    <div className="flex flex-col items-center justify-center w-full h-full text-center px-4">
      {/* Welcome Text */}
      <div className="flex items-center gap-2 text-xl sm:text-2xl font-semibold text-white tracking-wide">
        <span>Welcome 👋</span>
        <span>{username}</span>
        <span>❄️</span>
      </div>

      {/* Subtext */}
      <p className="mt-2 text-sm sm:text-base text-gray-200 font-medium">
        Select a chat to start messaging
      </p>

      {/* Chat Bubbles Icon */}
      <IoChatbubblesOutline className="mt-4 text-6xl sm:text-7xl text-white/90" />
    </div>
  );
};
