import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSocketContext } from "../context/SocketContext";

const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const { socket } = useSocketContext();

  const fetchFriends = async () => {
    setLoading(true);
    try {
      // 🔥 Changed endpoint to /friends
      const response = await fetch("/api/users/friends");
      const data = await response.json();

      if (!response.ok)
        throw new Error(data.error || "Failed to fetch friends");
      setConversations(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  // Listen for accepted requests to update list instantly
  useEffect(() => {
    if (!socket) return;

    socket.on("friendRequestAccepted", () => {
      fetchFriends(); // Refetch friends list instantly
      toast.success("Friend added successfully!");
    });

    return () => socket.off("friendRequestAccepted");
  }, [socket]);

  return { loading, conversations };
};

export default useGetConversations;
