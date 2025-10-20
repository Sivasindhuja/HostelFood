import React, { useState } from 'react';
import axios from 'axios';

const FeedbackForm = () => {
  const [form, setForm] = useState({
    day: '',
    time: '',
    rating: '',
    suggestion: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/feedback', form);
      alert('Feedback submitted!');
      setForm({ day: '', time: '', rating: '', suggestion: '' });
    } catch (err) {
      alert('Error submitting feedback');
      console.error(err);
    }
  };

  return (

   <div id='container'>
   <h2>Sri Padmavati mahila visvavidhyalayam hostels,kinnera block</h2>
   <h3>Hostel food feedback form</h3>
    <form onSubmit={handleSubmit}>
      <label>Day:</label>
      <input name="day" value={form.day} onChange={handleChange} required />

      <label>Time:</label>
      <select name="time" value={form.time} onChange={handleChange} required>
        <option value="">Select</option>
        <option value="Breakfast">Breakfast</option>
        <option value="Lunch">Lunch</option>
        <option value="Dinner">Dinner</option>
      </select>

      <label>Rating (1–5):</label>
      <input
        name="rating"
        type="number"
        min="1"
        max="5"
        value={form.rating}
        onChange={handleChange}
        required
      />

      <label>Suggestion:</label>
      <textarea name="suggestion" value={form.suggestion} onChange={handleChange} />

      <button type="submit">Submit Feedback</button>
    </form>
    </div>
   
  );
 

};

export default FeedbackForm;