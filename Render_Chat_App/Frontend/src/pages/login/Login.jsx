import React from "react";

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
      <div className="shadow-md w-full bg-yellow-700/20 rounded-lg backdrop-blur-lg border border-gray-100 p-6">
        <h1 className="text-3xl font-semibold text-center text-gray-300">
          Login
          <span className="text-blue-500"> Yarn</span>
        </h1>
        <form>
          <div className="flex flex-col">
            <label className="label p-2" />
            <span className="text-base label-text">Username</span>
            <input
              type="text"
              placeholder="Enter username"
              className="input input-ghost mt-2"
            />

            <label className="label p-2" />
            <span className="text-base label-text">Password</span>
            <input
              type="password"
              placeholder="Enter password"
              className="input input-ghost mt-2"
            />

            <a href="" className="link link-primary">
              Don't have an account?
            </a>

            <div>
              <button className="btn btn-block btn-md mt-2">Login</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
