import { useAuthContext } from "../../context/AuthContext";
import useConversationStore from "../../store/useConversation";
import { extractTime } from "../../utils/extractTime";

const Message = ({ message }) => {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversationStore();

  const fromMe = message.senderId === authUser?._id;

  const formattedTime = extractTime(message.createdAt);

  const chatClassName = fromMe ? "chat chat-end" : "chat chat-start";
  const profilePicture = fromMe
    ? authUser?.profilePicture
    : selectedConversation?.profilePicture;

  const bubbleBgColor = fromMe ? "bg-blue-500" : "bg-gray-700";

  return (
    <div className={`chat ${chatClassName}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img alt="User Avatar" src={profilePicture} />
        </div>
      </div>
      <div className="chat-header">
        <time className="text-xs opacity-50">{formattedTime}</time>
      </div>
      <div className={`chat-bubble text-white ${bubbleBgColor}`}>
        {message.message}
      </div>
      <div className="chat-footer opacity-50">Delivered</div>
    </div>
  );
};

export default Message;
