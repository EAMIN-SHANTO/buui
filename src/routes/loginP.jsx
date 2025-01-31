import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;

const LoginP = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("${import.meta.env.VITE_API_URL}/usersp/login", {
        email,
        password,
      });
      console.log("Login successful", response.data);
      // Store user info in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(response.data));
      navigate("/");
      // Reload the page to update the navbar state
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  // Rest of your LoginP component code remains the same

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 text-gray-800 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 text-gray-800 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">
          Don’t have an account? <a href="/registerp" className="text-blue-600 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default LoginP;
