import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          const errorData = await response.json();
          toast.error(errorData.message || "Failed to fetch conversations");
        }
        const data = await response.json();
        setConversations(data.users);
      } catch (error) {
        toast.error("Failed to fetch conversations");
      } finally {
        setLoading(false);
      }
    };
    getConversations();
  }, []);

  return { loading, conversations };
};

export default useGetConversations;
