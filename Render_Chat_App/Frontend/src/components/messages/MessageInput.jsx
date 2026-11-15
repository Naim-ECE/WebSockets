import { useState } from "react";
import { RiSendPlaneFill, RiImageAddLine, RiCloseLine } from "react-icons/ri";
import useSendMessage from "../../hooks/useSendMessage";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const { loading, sendMessage } = useSendMessage();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024)
        return toast.error("Image must be less than 5MB");
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() && !imageFile) return;

    await sendMessage(message, imageFile);
    setMessage("");
    setImageFile(null);
  };

  return (
    <form className="p-3 w-full bg-gray-900/50" onSubmit={handleSubmit}>
      {imageFile && (
        <div className="relative w-20 h-20 mb-2 rounded-lg overflow-hidden border border-gray-600 shadow-lg">
          <img
            src={URL.createObjectURL(imageFile)}
            alt="upload preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={() => setImageFile(null)}
            className="absolute top-1 right-1 bg-black/60 p-1 rounded-full text-white hover:bg-red-500 transition-colors"
          >
            <RiCloseLine size={12} />
          </button>
        </div>
      )}

      {/* Native Tailwind Neon Glow on focus-within */}
      <div className="relative flex items-center gap-2 w-full bg-gray-800/80 rounded-full border border-gray-700 transition-all duration-300 focus-within:border-blue-500 focus-within:shadow-[0_0_15px_rgba(59,130,246,0.5)]">
        <label className="cursor-pointer text-gray-400 hover:text-blue-400 transition-colors ml-3 active:scale-95">
          <RiImageAddLine size={22} />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>

        <input
          type="text"
          className="w-full bg-transparent py-3 px-2 text-white focus:outline-none placeholder-gray-500"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="mr-2 p-2 text-gray-400 hover:text-white transition-all duration-100 text-2xl cursor-pointer hover:scale-110 active:scale-90"
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm text-blue-500"></span>
          ) : (
            <RiSendPlaneFill className="text-blue-500" />
          )}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
