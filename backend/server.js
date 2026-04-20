import express from "express";
import cors from "cors";

import feedbackroutes from "./routes/feedback.js";
import authRoutes from "./routes/auth.js";
import complaintRoutes from "./routes/complaints.js";

const app = express(); // 

app.use(express.json());
app.use(cors());
import rateLimit from "express-rate-limit";

// Define rate limit: Max 100 requests per 15 minutes per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply to all routes or specific ones
app.use("/auth/", apiLimiter); // Prevent brute-force login
app.use("/feedback", apiLimiter);
app.use("/complaints", apiLimiter);

app.use('/auth', authRoutes);
app.use('/feedback', feedbackroutes);
app.use('/complaints', complaintRoutes); // ✅ missing earlier

app.listen(5000, () => {
  console.log("server running on port 5000");
});
