import { useState, useEffect } from "react";
import { useFriendActions } from "../hooks/useFriendActions";
import { IoClose, IoSearch } from "react-icons/io5";

const AddFriendModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("search"); // "search" or "requests"
  const {
    searchResults,
    requests,
    loading,
    searchFriends,
    fetchRequests,
    sendRequest,
    acceptRequest,
    rejectRequest,
  } = useFriendActions();

  useEffect(() => {
    if (isOpen) {
      fetchRequests();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    searchFriends(query);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-100 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white cursor-pointer">
            Add Friends
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800">
          <button
            onClick={() => setActiveTab("search")}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === "search" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"} cursor-pointer`}
          >
            Search Users
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex-1 py-3 text-sm font-semibold transition-colors flex justify-center items-center gap-2 ${activeTab === "requests" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"} cursor-pointer`}
          >
            Requests
            {requests.length > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                {requests.length}
              </span>
            )}
          </button>
        </div>

        <div className="p-4 h-80 overflow-y-auto">
          {/* SEARCH TAB */}
          {activeTab === "search" && (
            <>
              <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Search by username..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 p-2.5 rounded-lg text-white transition-colors cursor-pointer"
                >
                  <IoSearch size={20} />
                </button>
              </form>

              {loading ? (
                <p className="text-center text-gray-500 mt-10">Searching...</p>
              ) : searchResults.length === 0 ? (
                <p className="text-center text-gray-500 mt-10">
                  No users found.
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {searchResults.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between bg-gray-800/50 p-3 rounded-xl border border-gray-700/50"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={user.profilePicture}
                          alt="pfp"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-white font-bold text-sm">
                            {user.fullName}
                          </p>
                          <p className="text-gray-400 text-xs">
                            @{user.username}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => sendRequest(user._id)}
                        className="bg-blue-600 cursor-pointer hover:bg-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-full transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* REQUESTS TAB */}
          {activeTab === "requests" && (
            <div className="flex flex-col gap-3">
              {requests.length === 0 ? (
                <p className="text-center text-gray-500 mt-10">
                  No pending requests.
                </p>
              ) : (
                requests.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between bg-gray-800/50 p-3 rounded-xl border border-gray-700/50"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user.profilePicture}
                        alt="pfp"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-white font-bold text-sm">
                          {user.fullName}
                        </p>
                        <p className="text-gray-400 text-xs">
                          @{user.username}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => acceptRequest(user._id)}
                        className="bg-green-600 hover:bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => rejectRequest(user._id)}
                        className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddFriendModal;
