import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();
  const logout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Logout failed");
      }

      const data = await res.json();

      localStorage.removeItem("chat-user");
      setAuthUser(null);
    } catch (err) {
      toast.error("An error occurred during logout");
    } finally {
      setLoading(false);
    }
  };
  return { logout, loading };
};

export default useLogout;
