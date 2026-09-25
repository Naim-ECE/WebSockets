import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import connectToMongoDB from "./db/connectToMongoDB.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  connectToMongoDB(); // Call the function to connect to MongoDB
  console.log(`Server is running on port http://localhost:${PORT}`);
});
