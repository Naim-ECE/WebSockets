import { RiLogoutBoxLine } from "react-icons/ri";
import useLogout from "../../hooks/useLogout";

const LogoutButton = () => {
  const { logout, loading } = useLogout();
  return (
    <div>
      {loading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : (
        <RiLogoutBoxLine
          className="w-6 h-6 text-white cursor-pointer hover:text-gray-400"
          onClick={logout}
        />
      )}
    </div>
  );
};

export default LogoutButton;
