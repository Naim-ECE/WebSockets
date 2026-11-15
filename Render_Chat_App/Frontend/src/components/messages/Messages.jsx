import { useEffect, useLayoutEffect, useRef } from "react";
import useConversationStore from "../../store/useConversation";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../../skeleton/MessageSkeleton";
import Message from "./Message";
import { useSocketContext } from "../../context/SocketContext";
import notificationSound from "../../assets/sounds/notification1.mp3";

const Messages = () => {
  const {
    messages,
    addMessage,
    markMessageDeleted,
    removeMessage,
    markAllAsSeen,
    selectedConversation,
  } = useConversationStore();
  const { loading } = useGetMessages();
  const { socket } = useSocketContext();

  // Ref for the scrollable container
  const containerRef = useRef(null);

  // Instantly snaps to the bottom before the browser paints
  useLayoutEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, selectedConversation, loading]);

  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      if (selectedConversation?._id === newMessage.senderId) {
        addMessage(newMessage);

        const audio = new Audio(notificationSound);
        audio.play().catch((err) => console.log("Audio play blocked:", err));
      }
    });

    socket.on("messageDeleted", (messageId) => {
      markMessageDeleted(messageId);
    });

    socket.on("messagePermanentlyDeleted", (messageId) => {
      removeMessage(messageId);
    });

    socket.on("messagesSeen", () => {
      markAllAsSeen();
    });

    return () => {
      socket.off("newMessage");
      socket.off("messageDeleted");
      socket.off("messagePermanentlyDeleted");
      socket.off("messagesSeen");
    };
  }, [
    socket,
    addMessage,
    markMessageDeleted,
    removeMessage,
    markAllAsSeen,
    selectedConversation,
  ]);

  return (
    // Attached containerRef here
    <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-2 w-full">
      {loading && (
        <>
          <MessageSkeleton />
          <MessageSkeleton />
          <MessageSkeleton />
          <MessageSkeleton />
          <MessageSkeleton />
          <MessageSkeleton />
        </>
      )}

      {!loading &&
        messages?.length > 0 &&
        messages.map((message, index) => (
          <Message
            key={message._id}
            message={message}
            isLatest={index === messages.length - 1}
          />
        ))}

      {!loading && messages?.length === 0 && (
        <p className="text-center text-gray-500 mt-4 text-sm">
          Send a message to start the conversation
        </p>
      )}
    </div>
  );
};

export default Messages;
