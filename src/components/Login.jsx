import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isLogin, setIsLogin] = useState(true);
  const [msg, setMsg] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    const url = isLogin
      ? "http://localhost:5000/api/auth/login"
      : "http://localhost:5000/api/auth/register";

    try {
      const res = await axios.post(url, formData);
      if (res.data.token) localStorage.setItem("token", res.data.token);
      navigate("/homepage");
    } catch (err) {
      setMsg(err.response?.data?.msg || "An error occurred.");
    }
  };

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setMsg("");
    setFormData({ username: "", email: "", password: "" });
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="gradient-bg flex h-screen w-full items-center justify-center">
      <form onSubmit={handleSubmit}>
        <div className="flex min-h-[620px] min-w-[400px] flex-col items-center rounded-lg bg-white">
          <h1 className="m-20 text-3xl font-bold">
            {isLogin ? "Login" : "Sign Up"}
          </h1>
          {msg && <p className="mb-4 text-red-500">{msg}</p>}

          {!isLogin && (
            <input
              className="input-field mt-5 w-60"
              type="text"
              placeholder="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          )}
          <input
            className="input-field mt-5 w-60"
            type="email"
            placeholder="Email"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            className="input-field mt-5 w-60"
            type="password"
            placeholder="Password"
            name="password"
            autoComplete="off"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn-primary mt-5 font-bold">
            {isLogin ? "Login" : "Sign Up"}
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="btn-google mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Login with Google
          </button>

          <div className="flex-col mt-5">
            <h2>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <span
                className="cursor-pointer p-1 text-blue-500 hover:underline hover:text-blue-700"
                onClick={handleToggle}
              >
                {isLogin ? " Sign Up" : " Login"}
              </span>
            </h2>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
