import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";
import useConversationStore from "../../store/useConversation";
import UserProfile from "../../components/UserProfile";

export default function Home() {
  const { selectedConversation } = useConversationStore();

  return (
    <div className="flex flex-col sm:flex-row h-dvh sm:h-[90vh] w-full sm:max-w-5xl rounded-none sm:rounded-2xl overflow-hidden bg-black/40 backdrop-blur-xl border border-gray-800 shadow-2xl sm:p-2 relative">
      {/* Mobile Top Bar: Added shrink-0 so it never gets pushed up */}
      <div className="flex sm:hidden justify-between items-center p-3 bg-gray-900/80 border-b border-gray-800 z-50 w-full shrink-0">
        <h1 className="text-white font-bold text-xl tracking-wider">Yarn</h1>
        <UserProfile />
      </div>

      {/* Desktop Top Right */}
      <div className="absolute top-4 right-4 z-50 hidden sm:block">
        <UserProfile />
      </div>

      {/* Main Layout Area: Removed h-full, using flex-1 and overflow-hidden */}
      <div className="flex flex-1 overflow-hidden w-full relative">
        {/* Sidebar Area */}
        <div
          className={`${selectedConversation ? "hidden md:flex" : "flex"} w-full md:w-1/3 md:min-w-75 flex-col border-r border-gray-800`}
        >
          <Sidebar />
        </div>

        {/* Chat Area */}
        <div
          className={`${!selectedConversation ? "hidden md:flex" : "flex"} flex-1 relative`}
        >
          <MessageContainer />
        </div>
      </div>
    </div>
  );
}
