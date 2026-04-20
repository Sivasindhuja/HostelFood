import React, { useState } from 'react';
import axios from 'axios';

const ComplaintForm = () => {
  const [complaint, setComplaint] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.post(
        'http://localhost:5000/complaints',
        { complaint },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert('Complaint submitted!');
      setComplaint("");

    } catch (err) {
      alert('Error submitting complaint');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Hostel Complaint</h2>

      <textarea
        placeholder="Write your complaint"
        value={complaint}
        onChange={(e) => setComplaint(e.target.value)}
        required
      />

      <button type="submit">Submit</button>
    </form>
  );
};
export default ComplaintForm;