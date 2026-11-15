import { useRef, useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import useConversationStore from "../../store/useConversation";
import { extractTime } from "../../utils/extractTime";
import { RiDeleteBin6Line } from "react-icons/ri";
import useDeleteMessage from "../../hooks/useDeleteMessage";
import gsap from "gsap";

const Message = ({ message, isLatest }) => {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversationStore();
  const { deleteMessage } = useDeleteMessage();
  const messageRef = useRef(null);
  const bubbleRef = useRef(null); // Ref for the bubble glow
  const [showDelete, setShowDelete] = useState(false);

  const fromMe = message.senderId === authUser?._id;
  const formattedTime = extractTime(message.createdAt);

  useEffect(() => {
    if (isLatest && messageRef.current && bubbleRef.current) {
      // Pop-in animation
      gsap.fromTo(
        messageRef.current,
        { opacity: 0, scale: 0.85, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" },
      );

      // fadeGlow animation applied directly via GSAP
      gsap.fromTo(
        bubbleRef.current,
        { boxShadow: "0 0 0px rgba(255, 255, 255, 0)" },
        {
          boxShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
          duration: 0.4,
          yoyo: true,
          repeat: 1,
          ease: "power1.inOut",
        },
      );
    }
  }, [isLatest]);

  const handleDelete = async () => {
    const confirmMsg = message.isDeleted
      ? "Permanently delete this message for everyone?"
      : "Are you sure you want to delete this message?";

    if (window.confirm(confirmMsg)) {
      await deleteMessage(message._id);
    }
  };

  // Show delete button if it's my message OR if it's already deleted (so both can hard delete)
  const canDelete = fromMe || message.isDeleted;

  return (
    <div
      ref={messageRef}
      className={`chat ${fromMe ? "chat-end" : "chat-start"} mb-3 group`}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <div className="chat-image avatar">
        <div className="w-8 sm:w-10 rounded-full border border-gray-600 shadow-sm">
          <img
            alt="User Avatar"
            src={
              fromMe
                ? authUser?.profilePicture
                : selectedConversation?.profilePicture
            }
          />
        </div>
      </div>

      <div className="chat-header text-xs text-gray-400 mb-1 flex items-center gap-2">
        <time>{formattedTime}</time>
        {canDelete && showDelete && (
          <button
            onClick={handleDelete}
            className="text-red-400 hover:text-red-300 transition-colors animate-in fade-in duration-200"
            title={message.isDeleted ? "Permanently delete" : "Delete message"}
          >
            <RiDeleteBin6Line size={14} />
          </button>
        )}
      </div>

      <div
        ref={bubbleRef} // Attach ref for GSAP glow
        className={`chat-bubble text-white shadow-md transition-all duration-300 
          ${fromMe ? "bg-blue-600 hover:bg-linear-to-r hover:from-blue-600 hover:to-blue-500" : "bg-gray-700 hover:bg-linear-to-r hover:from-gray-700 hover:to-gray-600"}
          ${message.imageUrl ? "p-1.5 bg-transparent hover:bg-transparent" : ""}
          ${message.isDeleted ? "italic opacity-70" : ""}
        `}
      >
        {message.imageUrl && (
          <img
            src={message.imageUrl}
            alt="attachment"
            className="max-w-60 w-auto h-auto object-cover rounded-lg mb-1 border border-gray-600"
          />
        )}
        {message.message && <p>{message.message}</p>}
      </div>

      <div className="chat-footer text-[10px] text-gray-500 mt-1">
        {fromMe ? (message.isSeen ? "Seen" : "Delivered") : ""}
      </div>
    </div>
  );
};

export default Message;
