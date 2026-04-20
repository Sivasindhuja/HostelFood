import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("feedback");
  const [feedbacks, setFeedbacks] = useState([]);
  const [complaints, setComplaints] = useState([]);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const fb = await axios.get("http://localhost:5000/feedback", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const comp = await axios.get("http://localhost:5000/complaints", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFeedbacks(fb.data);
      setComplaints(comp.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>{role === "matron" ? "Matron Dashboard" : "Student Dashboard"}</h2>

      {/* Tabs */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setActiveTab("feedback")}>
          Feedback
        </button>

        <button onClick={() => setActiveTab("complaints")}>
          Complaints
        </button>
      </div>

      {/* Content */}
      {activeTab === "feedback" && (
        <div>
          <h3>Feedback List</h3>
          {feedbacks.map(f => (
            <div key={f.id} style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
              <p><b>Day:</b> {f.day}</p>
              <p><b>Time:</b> {f.time}</p>
              <p><b>Rating:</b> {f.rating}</p>
              <p><b>Suggestion:</b> {f.suggestion}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "complaints" && (
        <div>
          <h3>Complaint List</h3>
          {complaints.map(c => (
            <div key={c.id} style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
              <p><b>Name:</b> {c.name}</p>
              <p><b>Room:</b> {c.room_number}</p>
              <p><b>Complaint:</b> {c.complaint}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;