import { useState } from "react";
import { RiSendPlaneFill } from "react-icons/ri";
import useSendMessage from "../../hooks/useSendMessage";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const { loading, sendMessage } = useSendMessage();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) return;
    await sendMessage(message);
    setMessage("");
  };
  return (
    <form className="px-4 my-3" onSubmit={handleSubmit}>
      <div className="relative w-full">
        <input
          type="text"
          className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="absolute inset-y-0 right-0 flex items-center p-2 text-gray-400 hover:text-white transition-all duration-100 text-xl hover:text-2xl cursor-pointer bg-gray-700 rounded-full"
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <RiSendPlaneFill />
          )}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
