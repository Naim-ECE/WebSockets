import { useState } from "react";
import useConversationStore from "../store/useConversation";
import toast from "react-hot-toast";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { setMessages, selectedConversation } = useConversationStore();

  const sendMessage = async (message, imageFile) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("message", message);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await fetch(
        `/api/messages/send/${selectedConversation._id}`,
        {
          method: "POST",
          body: formData, // No Content-Type header needed with FormData
        },
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to send message");

      const currentMessages = useConversationStore.getState().messages;
      setMessages([...(currentMessages || []), data.data]);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return { sendMessage, loading };
};

export default useSendMessage;
