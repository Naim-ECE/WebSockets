import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import useUpdateProfile from "../hooks/useUpdateProfile";
import useConversationStore from "../store/useConversation";
import { FaCamera } from "react-icons/fa";
import toast from "react-hot-toast";

const UserProfile = () => {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversationStore();
  const { updateProfile, loading } = useUpdateProfile();
  const [hover, setHover] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024)
      return toast.error("Image must be less than 5MB");

    // 1. Show preview instantly
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // 2. Compress the image using Canvas
    const img = new Image();
    img.src = objectUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const MAX_WIDTH = 800;
      const MAX_HEIGHT = 800;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      // Convert canvas back to a File object (JPEG at 70% quality)
      canvas.toBlob(
        (blob) => {
          const compressedFile = new File([blob], file.name, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          // Send the tiny, compressed file to the backend
          updateProfile(compressedFile);
        },
        "image/jpeg",
        0.7,
      );
    };
  };

  const isChatOpen = !!selectedConversation;

  const imageUrl = preview
    ? preview
    : authUser?.profilePicture
      ? `${authUser.profilePicture}?t=${new Date(authUser.updatedAt || Date.now()).getTime()}`
      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQt2KTkSSFRWMfy3Hr_XjbHbs2dnoXoeu_Cb242tzcMug&s";

  return (
    <div className="flex items-center gap-3">
      <div
        onClick={() => document.getElementById("profile-upload").click()}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={`relative rounded-full overflow-hidden border-2 border-gray-600 shadow-lg cursor-pointer transition-all duration-300 ease-in-out ${
          isChatOpen ? "w-9 h-9" : "w-11 h-11"
        }`}
      >
        <img
          src={imageUrl}
          alt="Profile"
          className="w-full h-full object-cover"
        />

        <div
          className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${hover ? "opacity-100" : "opacity-0"}`}
        >
          {loading ? (
            <span className="loading loading-spinner loading-xs text-white"></span>
          ) : (
            <FaCamera className="text-white text-sm" />
          )}
        </div>
      </div>

      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="profile-upload"
        onChange={handleImageChange}
      />

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap ${isChatOpen ? "max-w-0 opacity-0" : "max-w-37.5 opacity-100"}`}
      >
        <p className="text-sm font-bold text-white truncate">
          {authUser?.fullName}
        </p>
        <p className="text-xs text-gray-400 truncate">@{authUser?.username}</p>
      </div>
    </div>
  );
};

export default UserProfile;
