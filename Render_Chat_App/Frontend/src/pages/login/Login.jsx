import { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../../hooks/useLogin";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto p-4">
      <div className="shadow-2xl w-full bg-gray-800/40 rounded-2xl backdrop-blur-xl border border-gray-700 p-8">
        <h1 className="text-3xl font-semibold text-center text-white mb-6">
          Login to
          <span className="text-blue-500"> Yarn</span>
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-control w-full">
            <label className="label pb-1">
              <span className="text-sm font-medium text-gray-300">
                Username
              </span>
            </label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input w-full bg-gray-900/50 border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white transition-all"
            />
          </div>

          <div className="form-control w-full">
            <label className="label pb-1">
              <span className="text-sm font-medium text-gray-300">
                Password
              </span>
            </label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input w-full bg-gray-900/50 border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white transition-all"
            />
          </div>

          <Link
            to="/signup"
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors text-center mt-2"
          >
            Don't have an account?
          </Link>

          <button
            className="btn w-full mt-4 bg-blue-600 hover:bg-blue-500 border-none text-white shadow-lg shadow-blue-500/30 transition-all active:scale-95"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
