import { FaSearch } from "react-icons/fa";

const SearchInput = () => {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700/20 backdrop-blur-lg border border-gray-100 border-none">
      <label className="input">
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
        <input type="search" required placeholder="Search" />
      </label>

      <button className="btn btn-circle bg-sky-400 text-white hover:bg-sky-500 border-none">
        <FaSearch />
      </button>
    </div>
  );
};

export default SearchInput;
