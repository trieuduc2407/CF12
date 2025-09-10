import express from "express";
import cors from "cors";
import 'dotenv/config';
import { connectDB } from "./config/db.js";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());
connectDB();

app.get("/", (req, res) => {
    res.send("Hello from backend!");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});