import React, { useState } from 'react';
import axios from 'axios';

const ComplaintForm = () => {
  const [form, setForm] = useState({
    name: '',
    roomNumber: '',
    complaint: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/complaints', form);
      alert('Complaint submitted!');
      setForm({ name: '', roomNumber: '', complaint: '' });
    } catch (err) {
      console.error(err);
      alert('Error submitting complaint');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Hostel Complaint Form</h2>

      <input
        name="name"
        placeholder="Your Name"
        value={form.name}
        onChange={handleChange}
        required
      />

      <input
        name="roomNumber"
        placeholder="Room Number"
        value={form.roomNumber}
        onChange={handleChange}
        required
      />

      <textarea
        name="complaint"
        placeholder="Write your complaint"
        value={form.complaint}
        onChange={handleChange}
        required
      />

      <button type="submit">Submit Complaint</button>
    </form>
  );
};

export default ComplaintForm;
