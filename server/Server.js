
import multer from "multer";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Answer from "./models/Answer.js";
import User from "./models/User.js";

dotenv.config();
const upload = multer({
  dest: "uploads/",
});


// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected ✅");
  })
  .catch((err) => {
    console.log("MongoDB Connection Error ❌", err);
  });

const app = express();

app.use(cors());
app.use(express.json());

// =========================
// HOME
// =========================

app.get("/", (req, res) => {
  res.json({
    message: "AI Interview Backend Running 🚀",
  });
});

// =========================
// SIGNUP
// =========================

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: "Account created successfully 🎉",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Signup failed",
      error: error.message,
    });
  }
});

// =========================
// LOGIN
// =========================

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    res.json({
      message: "Login successful 🎉",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
});

// =========================
// QUESTIONS
// =========================

app.get("/questions", (req, res) => {
  const questions = [
    "Tell me about yourself.",
    "What is React?",
    "What is Virtual DOM?",
    "Difference between let, var and const?",
    "Explain useState Hook.",
  ];

  res.json(questions);
});

// =========================
// SAVE INTERVIEW ANSWERS
// =========================

app.post("/answers", async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        message: "Answers are required",
      });
    }

    const newAnswer = new Answer({
      answers: answers,
    });

    await newAnswer.save();

    res.json({
      message: "Answers saved in MongoDB successfully 🚀",
      data: newAnswer,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error saving answers",
      error: error.message,
    });
  }
});

// =========================
// EVALUATE INTERVIEW
// =========================

app.post("/evaluate", (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        message: "Answers are required",
      });
    }

    let totalScore = 0;

    const evaluatedAnswers = answers.map((answer, index) => {
      const text = answer ? answer.trim() : "";

      let score = 0;
      let feedback = "";

      if (text.length === 0) {
        score = 0;
        feedback = "No answer provided.";
      } else if (text.length < 30) {
        score = 40;
        feedback = "Your answer is too short. Add more explanation.";
      } else if (text.length < 80) {
        score = 65;
        feedback = "Good start. Try adding examples and more details.";
      } else if (text.length < 150) {
        score = 80;
        feedback = "Good answer. It is reasonably clear and detailed.";
      } else {
        score = 90;
        feedback = "Excellent detail. Your answer is clear and well explained.";
      }

      totalScore += score;

      return {
        questionNumber: index + 1,
        answer: text,
        score: score,
        feedback: feedback,
      };
    });

    const finalScore =
      answers.length > 0
        ? Math.round(totalScore / answers.length)
        : 0;

    let overallFeedback = "";

    if (finalScore >= 80) {
      overallFeedback =
        "Excellent performance! Keep practicing to become even better. 🌟";
    } else if (finalScore >= 60) {
      overallFeedback =
        "Good performance. Improve your explanations and examples. 👍";
    } else if (finalScore >= 40) {
      overallFeedback =
        "You are making progress. Try giving more detailed answers. 💪";
    } else {
      overallFeedback =
        "Keep practicing and try the interview again. 🚀";
    }

    res.json({
      score: finalScore,
      feedback: overallFeedback,
      evaluatedAnswers: evaluatedAnswers,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Evaluation failed",
      error: error.message,
    });
  }
});
// =========================
// RESUME UPLOAD
// =========================

app.post("/resume-upload", upload.single("resume"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a resume",
      });
    }

    console.log("Resume uploaded:", req.file.originalname);

    res.json({
      message: "Resume uploaded successfully 🎉",
      fileName: req.file.originalname,
      fileSize: req.file.size,
    });

  } catch (error) {
    console.log("Resume upload error:", error);

    res.status(500).json({
      message: "Resume upload failed",
      error: error.message,
    });
  }
});

// =========================
// START SERVER
// =========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
