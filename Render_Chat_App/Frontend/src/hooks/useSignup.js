import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useSignup = () => {
  const [loading, setLoading] = useState(false);

  const { setAuthUser } = useAuthContext();

  const signup = async (
    fullName,
    username,
    password,
    confirmPassword,
    gender,
  ) => {
    const success = handleInputErrors(
      fullName,
      username,
      password,
      confirmPassword,
      gender,
    );
    if (!success) return;

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          username,
          password,
          confirmPassword,
          gender,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Signup failed");
      }

      const data = await res.json();

      localStorage.setItem("chat-user", JSON.stringify(data));
      setAuthUser(data);

      //   console.log(data);
    } catch (err) {
      toast.error("An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading };
};

export default useSignup;

const handleInputErrors = (
  fullName,
  username,
  password,
  confirmPassword,
  gender,
) => {
  if (!fullName || !username || !password || !confirmPassword || !gender) {
    toast.error("Please fill in all fields");
    return false;
  }

  if (password !== confirmPassword) {
    toast.error("Passwords do not match");
    return false;
  }

  if (password.length < 6) {
    toast.error("Password must be at least 6 characters");
    return false;
  }

  return true;
};
