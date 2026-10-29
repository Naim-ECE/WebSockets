import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";

export default function Home() {
  return (
    <div className="flex sm:h-112.5 md:h-170 w-full max-w-4xl rounded-lg overflow-hidden bg-gray-600/50 bg-clip-padding backdrop-blur-lg border border-gray-100 p-1.5">
      <Sidebar />
      <MessageContainer />
    </div>
  );
}
