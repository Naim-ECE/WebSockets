import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useUpdateProfile = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const updateProfile = async (file) => {
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("profilePic", file);

      const response = await fetch("/api/users/update-profile", {
        method: "PUT",
        body: formData,
      });

      // 🔥 Check if the response is valid before parsing
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        throw new Error("Server error. Please check backend logs.");
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      // Force a timestamp update to break browser image caching
      const updatedUser = { ...data, updatedAt: new Date().toISOString() };

      localStorage.setItem("chat-user", JSON.stringify(updatedUser));
      setAuthUser(updatedUser);

      toast.success("Profile picture updated!");
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, loading };
};

export default useUpdateProfile;
