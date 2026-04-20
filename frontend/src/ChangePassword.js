import React, { useState } from "react";
import axios from "axios";

const ChangePassword = () => {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:5000/auth/change-password",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Password changed!");
    } catch (err) {
      alert("Error changing password");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Change Password</h3>

      <input
        name="oldPassword"
        type="password"
        placeholder="Old Password"
        onChange={handleChange}
        required
      />

      <input
        name="newPassword"
        type="password"
        placeholder="New Password"
        onChange={handleChange}
        required
      />

      <button type="submit">Change Password</button>
    </form>
  );
};

export default ChangePassword;