import { useState } from "react";
import toast from "react-hot-toast";

export const useFriendActions = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchFriends = async (query) => {
    if (!query) return setSearchResults([]);
    setLoading(true);
    try {
      const res = await fetch(`/api/users/search?query=${query}`);
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      toast.error("Error searching users");
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/users/requests");
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error(err);
    }
  };

  const sendRequest = async (id) => {
    try {
      const res = await fetch(`/api/users/request/${id}`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to send");
      toast.success("Request sent!");
      setSearchResults((prev) => prev.filter((u) => u._id !== id)); // Remove from search UI
    } catch (err) {
      toast.error(err.message);
    }
  };

  const acceptRequest = async (id) => {
    try {
      const res = await fetch(`/api/users/accept/${id}`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to accept");
      toast.success("Friend added!");
      setRequests((prev) => prev.filter((u) => u._id !== id));
      // Note: Socket will handle updating the sidebar
    } catch (err) {
      toast.error(err.message);
    }
  };

  const rejectRequest = async (id) => {
    try {
      await fetch(`/api/users/reject/${id}`, { method: "POST" });
      setRequests((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      toast.error("Error rejecting");
    }
  };

  return {
    searchResults,
    requests,
    loading,
    searchFriends,
    fetchRequests,
    sendRequest,
    acceptRequest,
    rejectRequest,
  };
};
