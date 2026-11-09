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
    <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
      <div className="shadow-md w-full bg-yellow-700/20 rounded-lg backdrop-blur-lg border border-gray-100 p-6">
        <h1 className="text-3xl font-semibold text-center text-gray-300">
          Login to
          <span className="text-blue-500"> Yarn</span>
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label className="label p-2" />
            <span className="text-base label-text">Username</span>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input input-ghost mt-2"
            />

            <label className="label p-2" />
            <span className="text-base label-text">Password</span>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-ghost mt-2"
            />

            <Link
              to="/signup"
              className="link text-blue-400 hover:text-blue-600 active:text-black"
            >
              Don't have an account?
            </Link>

            <div>
              <button className="btn btn-block btn-md mt-2" disabled={loading}>
                {loading ? (
                  <span className="loading loading-spinner loading-lg"></span>
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
