import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("feedback");
  const [feedbacks, setFeedbacks] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [filterDay, setFilterDay] = useState("");
  const [filterTime, setFilterTime] = useState("");

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
    <div className="dashboard">
      <h2>{role === "matron" ? "Matron Dashboard" : "Student Dashboard"}</h2>

      <div className="tabs">
        <button
          className={activeTab === "feedback" ? "active" : ""}
          onClick={() => setActiveTab("feedback")}
        >
          Feedback
        </button>

        <button
          className={activeTab === "complaints" ? "active" : ""}
          onClick={() => setActiveTab("complaints")}
        >
          Complaints
        </button>
      </div>

      {/* FEEDBACK */}
      {activeTab === "feedback" && (
        <div className="cards">
          <h3>Feedback List</h3>

          {role === "matron" && (
            <div>
              <input
                placeholder="Filter by Day"
                value={filterDay}
                onChange={(e) => setFilterDay(e.target.value)}
              />

              <select
                value={filterTime}
                onChange={(e) => setFilterTime(e.target.value)}
              >
                <option value="">All Times</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
              </select>
            </div>
          )}

          {feedbacks
            .filter(f =>
              (filterDay === "" || f.day.toLowerCase().includes(filterDay.toLowerCase())) &&
              (filterTime === "" || f.time === filterTime)
            )
            .map(f => (
              <div key={f.id} className="card">
                <p><b>Day:</b> {f.day}</p>
                <p><b>Time:</b> {f.time}</p>
                <p><b>Rating:</b> {f.rating}</p>
                <p><b>Suggestion:</b> {f.suggestion}</p>
                <p><b>Submitted:</b> {new Date(f.submitted_at).toLocaleString()}</p>
              </div>
            ))}
        </div>
      )}

      {/* COMPLAINTS */}
      {activeTab === "complaints" && (
        <div>
          <h3>Complaint List</h3>

          {complaints.map(c => (
            <div key={c.id} className="card">
              <p><b>Name:</b> {c.name}</p>
              <p><b>Room:</b> {c.room_number}</p>
              <p><b>Complaint:</b> {c.complaint}</p>
              <p><b>Status:</b> {c.status}</p>
              <p><b>Created:</b> {new Date(c.created_at).toLocaleString()}</p>

              {role === "matron" && (
                <select
                  value={c.status}
                  onChange={async (e) => {
                    await axios.put(
                      `http://localhost:5000/complaints/${c.id}/status`,
                      { status: e.target.value },
                      {
                        headers: {
                          Authorization: `Bearer ${token}`
                        }
                      }
                    );
                    fetchData();
                  }}
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;