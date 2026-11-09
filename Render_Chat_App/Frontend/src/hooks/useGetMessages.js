import { useEffect, useState } from "react";
import useConversationStore from "../store/useConversation";
import toast from "react-hot-toast";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } =
    useConversationStore();
  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      setMessages([]); // Clear previous messages when fetching new ones
      try {
        const response = await fetch(
          `/api/messages/${selectedConversation._id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to get messages");
        }
        const data = await response.json();
        setMessages(data.data || []);
      } catch (error) {
        toast.error(
          error.message || "An error occurred while fetching messages",
        );
      } finally {
        setLoading(false);
      }
    };

    if (selectedConversation?._id) {
      getMessages();
    }
  }, [selectedConversation?._id, setMessages]);

  return { messages, loading };
};

export default useGetMessages;
