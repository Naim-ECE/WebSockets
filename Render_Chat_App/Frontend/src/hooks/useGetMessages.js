import { useEffect, useState } from "react";
import useConversationStore from "../store/useConversation";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { setMessages, selectedConversation } = useConversationStore();

  useEffect(() => {
    const getMessages = async () => {
      if (!selectedConversation?._id) return;

      setLoading(true);
      setMessages([]);

      try {
        const response = await fetch(
          `/api/messages/${selectedConversation._id}`,
        );
        const data = await response.json();

        if (!response.ok) {
          setMessages([]);
          return;
        }

        setMessages(data.data || []);

        await fetch(`/api/messages/seen/${selectedConversation._id}`, {
          method: "PUT",
        });
      } catch (error) {
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    getMessages();
  }, [selectedConversation?._id, setMessages]);

  return { loading };
};

export default useGetMessages;
