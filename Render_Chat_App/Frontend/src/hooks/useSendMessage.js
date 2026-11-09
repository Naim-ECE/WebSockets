import { useState } from "react";
import useConversationStore from "../store/useConversation";
import toast from "react-hot-toast";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { setMessages, selectedConversation } = useConversationStore();

  const sendMessage = async (message) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/messages/send/${selectedConversation._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        },
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send message");
      }
      const data = await response.json();

      const currentMessages = useConversationStore.getState().messages;
      const safeMessages = Array.isArray(currentMessages)
        ? currentMessages
        : [];
      setMessages([...safeMessages, data.data || data]);
    } catch (error) {
      toast.error(
        error.message || "An error occurred while sending the message",
      );
    } finally {
      setLoading(false);
    }
  };
  return { sendMessage, loading };
};

export default useSendMessage;
