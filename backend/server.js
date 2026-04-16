
import express from "express";
import cors from "cors";
import feedbackroutes from "./routes/feedback.js"
import authRoutes from "./routes/auth.js";

app.use('/auth', authRoutes);
const app=express();
//middleware

app.use(express.json());
app.use(cors());
//use that route as middleware
app.use('/feedback',feedbackroutes)

app.listen(5000,()=>{
    console.log("server running on port 5000");
})
