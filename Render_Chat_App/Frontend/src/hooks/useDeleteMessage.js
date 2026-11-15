import { useState } from "react";
import useConversationStore from "../store/useConversation";
import toast from "react-hot-toast";

const useDeleteMessage = () => {
  const [loading, setLoading] = useState(false);
  const { markMessageDeleted, removeMessage } = useConversationStore();

  const deleteMessage = async (messageId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/messages/delete/${messageId}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to delete message");

      // If it was permanently deleted, remove it. Otherwise, soft delete it.
      if (data.permanent) {
        removeMessage(messageId);
      } else {
        markMessageDeleted(messageId);
      }

      toast.success(
        data.permanent ? "Message permanently removed" : "Message removed",
      );
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { deleteMessage, loading };
};

export default useDeleteMessage;
