import { useState } from "react";
import GenderCheckbox from "./genderCheckbox";
import { Link } from "react-router-dom";
import useSignup from "../../hooks/useSignup";

export default function SignUp() {
  const [inputs, setInputs] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const { signup, loading } = useSignup();

  const handleGenderChange = (gender) => {
    setInputs({ ...inputs, gender });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(
      inputs.fullName,
      inputs.username,
      inputs.password,
      inputs.confirmPassword,
      inputs.gender,
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
      {loading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : (
        <div className="shadow-md w-full bg-yellow-700/20 rounded-lg backdrop-blur-lg border border-gray-100 p-6">
          <h1 className="text-3xl font-semibold text-center text-gray-300">
            SignUp to
            <span className="text-blue-500"> Yarn</span>
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label className="label p-2" />
              <span className="text-base label-text">Fullname</span>
              <input
                type="text"
                placeholder="Enter fullname"
                className="input input-ghost mt-2"
                value={inputs.fullName}
                onChange={(e) =>
                  setInputs({ ...inputs, fullName: e.target.value })
                }
              />

              <label className="label p-2" />
              <span className="text-base label-text">Username</span>
              <input
                type="text"
                placeholder="Enter username"
                className="input input-ghost mt-2"
                value={inputs.username}
                onChange={(e) =>
                  setInputs({ ...inputs, username: e.target.value })
                }
              />

              <label className="label p-2" />
              <span className="text-base label-text">Password</span>
              <input
                type="password"
                placeholder="Enter password"
                className="input input-ghost mt-2"
                value={inputs.password}
                onChange={(e) =>
                  setInputs({ ...inputs, password: e.target.value })
                }
              />

              <label className="label p-2" />
              <span className="text-base label-text">Confirm Password</span>
              <input
                type="password"
                placeholder="Confirm password"
                className="input input-ghost mt-2"
                value={inputs.confirmPassword}
                onChange={(e) =>
                  setInputs({ ...inputs, confirmPassword: e.target.value })
                }
              />

              <GenderCheckbox
                onGenderChange={handleGenderChange}
                selectedGender={inputs.gender}
              />

              <Link
                to="/login"
                className="link text-blue-400 hover:text-blue-600 active:text-black"
              >
                Already have an account?
              </Link>

              <div>
                <button className="btn btn-block btn-md mt-2">SignUp</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
