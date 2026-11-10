import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversationStore from "../store/useConversation";
import notificationSound from "../assets/sounds/notification1.mp3";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { messages, setMessages } = useConversationStore();

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      newMessage.shouldFadeandGlow = true;
      const audio = new Audio(notificationSound);
      audio.play();
      setMessages([...messages, newMessage]);
    });

    return () => {
      socket?.off("newMessage");
    };
  }, [socket, setMessages, messages]);
};

export default useListenMessages;
