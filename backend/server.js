import express from "express";
import cors from "cors";

import feedbackroutes from "./routes/feedback.js";
import authRoutes from "./routes/auth.js";
import complaintRoutes from "./routes/complaints.js";

const app = express(); // ✅ FIRST

app.use(express.json());
app.use(cors());

app.use('/auth', authRoutes);
app.use('/feedback', feedbackroutes);
app.use('/complaints', complaintRoutes); // ✅ missing earlier

app.listen(5000, () => {
  console.log("server running on port 5000");
});
