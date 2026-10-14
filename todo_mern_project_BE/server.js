import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoute.js";
import todoRoutes from "./routes/todoRoute.js"; 
import connectDB from "./config/db.js";

console.log('server is starting ');
const app = express();

// Connect to MongoDB
connectDB();
console.log('message after db connection ');
// Middleware
app.use(cors());
// app.use(cors({
//   origin: [
//     "https://your-app.netlify.app",
//     "http://localhost:5173"
//   ],
//   credentials: true
// }));
app.use(express.json());

console.log('going control at the routes ');
// Routes
app.use("/api", userRoutes);
app.use("/api", todoRoutes);

console.log('server listening.............');
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
