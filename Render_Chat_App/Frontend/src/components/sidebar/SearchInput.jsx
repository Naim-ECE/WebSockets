import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import useConversationStore from "../../store/useConversation";
import useGetConversations from "../../hooks/useGetConversations";
import toast from "react-hot-toast";

const SearchInput = () => {
  const [search, setSearch] = useState("");
  const { setSelectedConversation } = useConversationStore();
  const { conversations } = useGetConversations();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!search.trim()) return;

    const foundConversation = conversations?.find((conversation) =>
      conversation.fullName.toLowerCase().includes(search.toLowerCase()),
    );

    if (foundConversation) {
      setSelectedConversation(foundConversation);
      setSearch(""); // Clear search on success
    } else {
      toast.error("No user found with that name.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700/20 backdrop-blur-lg border-none"
    >
      <label className="input rounded-lg w-full">
        <svg
          className="h-[1em] opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
        <input
          type="search"
          required
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>

      <button
        className="btn btn-circle bg-sky-400 text-white hover:bg-sky-500 border-none"
        type="submit"
      >
        <FaSearch />
      </button>
    </form>
  );
};

export default SearchInput;
