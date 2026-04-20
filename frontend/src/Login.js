import React, { useState } from "react";
import axios from "axios";

const Login = ({ setLoggedIn }) => {
  const [form, setForm] = useState({
  email: "",
  password: ""
});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/auth/login",
        form
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      setLoggedIn(true);

    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>

      <input
  name="email"
  placeholder="Email"
  onChange={handleChange}
  required
/>
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        required
      />

      <button type="submit">Login</button>
    </form>
  );
};

export default Login;