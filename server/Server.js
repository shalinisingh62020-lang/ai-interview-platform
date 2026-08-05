import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Answer from "./models/Answer.js";

dotenv.config();
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected ✅");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "AI Interview Backend Running 🚀",
  });
});


app.get("/questions", (req, res) => {
  const questions = [
    "Tell me about yourself.",
    "What is React?",
    "What is Virtual DOM?",
    "Difference between let, var and const?",
    "Explain useState Hook."
  ];

  res.json(questions);
});


app.post("/answers", (req, res) => {
  const { answers } = req.body;

  console.log("User Answers:", answers);

  res.json({
    message: "Answers saved successfully 🚀",
    answers: answers
  });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});