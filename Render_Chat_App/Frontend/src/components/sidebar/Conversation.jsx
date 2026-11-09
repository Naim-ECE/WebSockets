import useConversationStore from "../../store/useConversation";

const Conversation = ({ conversation, emoji, lastIndex }) => {
  const { selectedConversation, setSelectedConversation } =
    useConversationStore();

  const isSelected = selectedConversation?._id === conversation._id;
  return (
    <>
      <div
        className={`flex items-center gap-2 p-2 hover:bg-blue-700/50 hover:scale-103 transition-all rounded-lg cursor-pointer ${isSelected ? "bg-blue-700/50" : ""}`}
        onClick={() => setSelectedConversation(conversation)}
      >
        <div className="avatar avatar-online">
          <div className="w-11 rounded-full">
            <img src={conversation.profilePicture} alt="User-Avatar" />
          </div>
        </div>
        <div className=" w-full flex justify-between items-center">
          <p className="font-bold text-gray-200">{conversation.fullName}</p>
          <span className="pl-8">
            <img
              src={emoji}
              alt="emoji"
              className="w-7 h-7 rounded-full object-cover"
            />
          </span>
        </div>
      </div>
      {!lastIndex && <div className="divider my-0 py-0 h-1" />}
    </>
  );
};

export default Conversation;
