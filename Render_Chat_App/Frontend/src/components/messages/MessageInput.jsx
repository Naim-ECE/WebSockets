import { RiSendPlaneFill } from "react-icons/ri";

const MessageInput = () => {
  return (
    <form className="px-4 my-3">
      <div className="relative w-full">
        <input
          type="text"
          className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
        />
        <button type="submit" className="absolute inset-y-0 right-0 flex items-center p-2 text-gray-400 hover:text-white transition-all duration-100 text-xl hover:text-2xl cursor-pointer bg-gray-700 rounded-full">
          <RiSendPlaneFill />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
