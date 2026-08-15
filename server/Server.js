
import fs from "fs";
import crypto from "crypto";
import { PDFParse } from "pdf-parse";
import multer from "multer";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Answer from "./models/Answer.js";
import User from "./models/User.js";
import OpenAI from "openai";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
transporter.verify((error, success) => {
  if (error) {
    console.log("EMAIL ERROR ❌");
    console.log(error);
  } else {
    console.log("EMAIL SERVER READY ✅");
  }
});
console.log(
  "JWT_SECRET loaded:",
  !!process.env.JWT_SECRET
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();

const upload = multer({
  dest: "uploads/",
});

app.use(cors());
app.use(express.json());


// =====================================================
// MONGODB CONNECTION
// =====================================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected ✅");
  })
  .catch((error) => {
    console.log("MongoDB Connection Error ❌");
    console.log(error.message);
  });


// =====================================================
// HOME
// =====================================================

app.get("/", (req, res) => {
  res.json({
    message: "AI Interview Backend Running 🚀",
  });
});


// =====================================================
// SIGNUP
// =====================================================

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

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


// =====================================================
// LOGIN
// =====================================================

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

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

    // Create JWT token
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({
      message: "Login successful 🎉",
      token: token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.log("Login error:", error);

    res.status(500).json({
      message: "Login failed",
    });
  }
});
// =====================================================
// FORGOT PASSWORD
// =====================================================

app.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Please enter your email",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(404).json({
        message: "No account found with this email",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Save token
    user.resetToken = resetToken;

    // Token valid for 15 minutes
    user.resetTokenExpiry = new Date(
      Date.now() + 15 * 60 * 1000
    );

    await user.save();

    // Reset link
    const resetLink =`http://10.199.197.172:5173/reset-password?token=${resetToken}`;

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "AI Interview Platform - Reset Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">

          <h2>Password Reset</h2>

          <p>Hello ${user.name},</p>

          <p>
            We received a request to reset your password.
          </p>

          <p>
            Click the button below to create a new password:
          </p>

          <a
            href="${resetLink}"
            style="
              display: inline-block;
              padding: 12px 20px;
              background: #2563eb;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
            "
          >
            Reset Password
          </a>

          <p>
            This link will expire in 15 minutes.
          </p>

          <p>
            If you did not request this password reset,
            you can safely ignore this email.
          </p>

          <p>
            Regards,<br>
            AI Interview Platform
          </p>

        </div>
      `,
    });

    console.log("Password reset email sent to:", user.email);

    res.json({
      message: "Password reset link sent to your email 📧",
    });

  } catch (error) {
    console.error("Forgot password error:", error);

    res.status(500).json({
      message: "Failed to send password reset email",
      error: error.message,
    });
  }
});
// =====================================================
// RESET PASSWORD
// =====================================================

app.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        message: "Token and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: {
        $gt: new Date(),
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    user.password = hashedPassword;

    // Remove reset token after successful reset
    user.resetToken = null;
    user.resetTokenExpiry = null;

    await user.save();

    res.json({
      message: "Password reset successfully 🎉",
    });

  } catch (error) {
    console.error("Reset password error:", error);

    res.status(500).json({
      message: "Password reset failed",
    });
  }
});

// =====================================================
// SAVE INTERVIEW ANSWERS
// =====================================================

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
      message:
        "Answers saved in MongoDB successfully 🚀",

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


// =====================================================
// AI EVALUATE INTERVIEW ANSWERS
// =====================================================

app.post("/evaluate", async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        message: "Answers are required",
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        message: "OpenAI API key is not configured.",
      });
    }

    const evaluatedAnswers = [];

    for (let i = 0; i < answers.length; i++) {
      const answerText =
        typeof answers[i] === "string"
          ? answers[i].trim()
          : "";

      if (!answerText) {
        evaluatedAnswers.push({
          questionNumber: i + 1,
          answer: "",
          score: 0,
          feedback: "No answer provided.",
          strengths: [],
          improvements: ["Provide an answer to the question."],
        });

        continue;
      }

      const response = await openai.responses.create({
        model: process.env.OPENAI_MODEL || "gpt-5",

        instructions: `
You are an interview evaluator for a student preparing for technical interviews.

Evaluate the candidate's answer fairly and constructively.

Focus on:
- Relevance
- Technical correctness
- Clarity
- Completeness
- Communication

Do not judge the candidate's personality, appearance, accent, or background.

Return ONLY valid JSON in this exact structure:

{
  "score": 0,
  "feedback": "short detailed feedback",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"]
}

The score must be an integer from 0 to 100.
`,

        input: `
Interview Question:
${answers[i].question || "Technical interview question"}

Candidate Answer:
${answerText}
`,
      });

      let aiResult;

      try {
        aiResult = JSON.parse(response.output_text);
      } catch (parseError) {
        console.log(
          "AI JSON parsing error:",
          response.output_text
        );

        aiResult = {
          score: 0,
          feedback:
            "The AI evaluation could not be processed.",
          strengths: [],
          improvements: [
            "Please try submitting the answer again.",
          ],
        };
      }

      evaluatedAnswers.push({
        questionNumber: i + 1,
        answer: answerText,
        score: Math.min(
          100,
          Math.max(0, Number(aiResult.score) || 0)
        ),
        feedback:
          aiResult.feedback ||
          "No feedback available.",
        strengths: Array.isArray(aiResult.strengths)
          ? aiResult.strengths
          : [],
        improvements: Array.isArray(
          aiResult.improvements
        )
          ? aiResult.improvements
          : [],
      });
    }

    const totalScore = evaluatedAnswers.reduce(
      (sum, item) => sum + item.score,
      0
    );

    const finalScore =
      evaluatedAnswers.length > 0
        ? Math.round(
            totalScore / evaluatedAnswers.length
          )
        : 0;

    let overallFeedback;

    if (finalScore >= 80) {
      overallFeedback =
        "Excellent performance! Your answers are strong and well explained. 🌟";
    } else if (finalScore >= 60) {
      overallFeedback =
        "Good performance. Improve technical depth and examples to make your answers stronger. 👍";
    } else if (finalScore >= 40) {
      overallFeedback =
        "You are making progress. Focus on clarity, correctness, and providing better explanations. 💪";
    } else {
      overallFeedback =
        "Keep practicing. Try to provide clearer and more complete answers. 🚀";
    }

    res.json({
      score: finalScore,
      feedback: overallFeedback,
      evaluatedAnswers,
    });

  } catch (error) {
    console.error(
      "AI Evaluation Error:",
      error
    );

    res.status(500).json({
      message: "AI evaluation failed",
      error: error.message,
    });
  }
});


// =====================================================
// ROLE-WISE INTERVIEW QUESTION BANK
// =====================================================

const questionBank = {
  "Frontend Developer": [
    "What is the difference between let, const, and var in JavaScript?",
    "What is the Virtual DOM in React?",
    "Explain the difference between props and state in React.",
    "What is the purpose of the useState Hook?",
    "What is the purpose of the useEffect Hook?",
    "What is event delegation in JavaScript?",
    "What is the difference between == and === in JavaScript?",
    "How does responsive web design work?",
    "What is the difference between Flexbox and CSS Grid?",
    "How would you improve the performance of a React application?",
  ],

  "Backend Developer": [
    "What is the difference between authentication and authorization?",
    "What is a REST API?",
    "What are HTTP methods and when are they used?",
    "What is middleware in Express.js?",
    "What is the difference between SQL and NoSQL databases?",
    "What is JWT and how is it used for authentication?",
    "How does password hashing work?",
    "What is error handling in a backend application?",
    "What is the difference between synchronous and asynchronous operations in Node.js?",
    "How would you design a scalable backend API?",
  ],

  "Full Stack Developer": [
    "What is the role of a frontend and backend in a full-stack application?",
    "How does a React frontend communicate with a Node.js backend?",
    "What is a REST API and how is it used in full-stack applications?",
    "How does JWT-based authentication work?",
    "What is CORS and why is it needed?",
    "What is the difference between SQL and NoSQL databases?",
    "How would you securely store user passwords?",
    "What is state management in React?",
    "How would you debug an API request that is failing?",
    "How would you deploy a full-stack web application?",
  ],

  "Python Developer": [
    "What are the main features of Python?",
    "What is the difference between a list and a tuple in Python?",
    "What are Python dictionaries and how are they used?",
    "What is the difference between == and is in Python?",
    "What are functions and lambda functions in Python?",
    "What is exception handling in Python?",
    "What are Python decorators?",
    "What is object-oriented programming in Python?",
    "What is the difference between shallow copy and deep copy?",
    "How would you optimize a slow Python program?",
  ],

  "Java Developer": [
    "What are the main features of Java?",
    "What is the difference between JDK, JRE, and JVM?",
    "Explain the four principles of object-oriented programming.",
    "What is the difference between == and equals() in Java?",
    "What is method overloading and method overriding?",
    "What is exception handling in Java?",
    "What is the difference between an interface and an abstract class?",
    "What is the Java Collections Framework?",
    "What is multithreading in Java?",
    "What is Spring Boot and why is it commonly used?",
  ],

  "Cybersecurity Analyst": [
    "What is the difference between a vulnerability, threat, and risk?",
    "What is phishing and how can users protect themselves?",
    "What is the purpose of a firewall?",
    "What is the difference between symmetric and asymmetric encryption?",
    "What is SQL injection?",
    "What is Cross-Site Scripting (XSS)?",
    "What is the principle of least privilege?",
    "What is multi-factor authentication and why is it important?",
    "What is the purpose of network scanning in cybersecurity?",
    "What is the OWASP Top 10?",
  ],
};
// =====================================================
// RANDOM ROLE-WISE INTERVIEW QUESTIONS
// =====================================================

app.post("/generate-questions", (req, res) => {
  try {
    const { jobRole, experience } = req.body;

    if (!jobRole || !experience) {
      return res.status(400).json({
        message: "Job role and experience are required.",
      });
    }

    const roleQuestions = questionBank[jobRole];

    if (!roleQuestions) {
      return res.status(400).json({
        message: "No question bank found for this job role.",
      });
    }

    // Create a copy and shuffle it
    const shuffledQuestions = [...roleQuestions].sort(
      () => Math.random() - 0.5
    );

    // Select 5 random questions
    const selectedQuestions = shuffledQuestions.slice(0, 5);

    console.log(
      `Generated ${selectedQuestions.length} questions for ${jobRole} (${experience})`
    );

    res.json({
      questions: selectedQuestions,
      jobRole,
      experience,
    });

  } catch (error) {
    console.error("Question Generation Error:", error);

    res.status(500).json({
      message: "Failed to generate interview questions.",
    });
  }
});

// =========================================
// RESUME UPLOAD + PDF TEXT EXTRACTION + ANALYSIS
// =====================================================

app.post(
  "/resume-upload",
  upload.single("resume"),
  async (req, res) => {

    try {

      if (!req.file) {

        return res.status(400).json({
          message: "Please upload a resume",
        });
      }

      console.log(
        "Resume uploaded:",
        req.file.originalname
      );


      // -------------------------------------------------
      // READ PDF
      // -------------------------------------------------

      const pdfBuffer =
        fs.readFileSync(req.file.path);


      // -------------------------------------------------
      // EXTRACT PDF TEXT
      // -------------------------------------------------

      const parser = new PDFParse({
        data: pdfBuffer,
      });

      const pdfData =
        await parser.getText();

      const resumeText =
        pdfData.text;

      await parser.destroy();

      console.log(
        "Resume text extracted successfully ✅"
      );


      // -------------------------------------------------
      // BASIC RESUME ANALYSIS
      // -------------------------------------------------

      const text =
        resumeText.toLowerCase();


      // -------------------------------------------------
      // SKILLS LIST
      // -------------------------------------------------

      const skills = [

        "javascript",
        "react",
        "node.js",
        "python",
        "java",
        "c++",
        "html",
        "css",
        "mongodb",
        "postgresql",
        "mysql",
        "git",
        "github",
        "docker",
        "aws",
        "sql",
        "express",
        "typescript",
        "tailwind",
        "spring boot",

      ];


      // -------------------------------------------------
      // FOUND SKILLS
      // -------------------------------------------------

      const foundSkills =
        skills.filter((skill) =>
          text.includes(
            skill.toLowerCase()
          )
        );


      // -------------------------------------------------
      // MISSING SKILLS
      // -------------------------------------------------

      const missingSkills =
        skills.filter(
          (skill) =>
            !text.includes(
              skill.toLowerCase()
            )
        );


      // -------------------------------------------------
      // RESUME SCORE
      // -------------------------------------------------

      let score = 0;


      // Skills
      score += Math.min(
        foundSkills.length * 4,
        40
      );


      // Resume length
      if (resumeText.length > 1500) {

        score += 20;

      } else if (
        resumeText.length > 800
      ) {

        score += 10;
      }


      // Projects
      if (
        text.includes("project") ||
        text.includes("projects")
      ) {

        score += 15;
      }


      // Experience
      if (
        text.includes("experience") ||
        text.includes("internship")
      ) {

        score += 15;
      }


      // Education
      if (
        text.includes("education") ||
        text.includes("b.tech") ||
        text.includes("bachelor") ||
        text.includes("degree")
      ) {

        score += 10;
      }


      // Maximum score
      score = Math.min(
        score,
        100
      );


      // -------------------------------------------------
      // SUGGESTIONS
      // -------------------------------------------------

      const suggestions = [];


      if (
        foundSkills.length < 5
      ) {

        suggestions.push(
          "Add more relevant technical skills."
        );
      }


      if (
        !text.includes("project") &&
        !text.includes("projects")
      ) {

        suggestions.push(
          "Add projects with technologies and your contribution."
        );
      }


      if (
        !text.includes("experience") &&
        !text.includes("internship")
      ) {

        suggestions.push(
          "Add internship, training or practical experience if applicable."
        );
      }


      if (
        !text.includes("github")
      ) {

        suggestions.push(
          "Add your GitHub profile to showcase your projects."
        );
      }


      if (
        !text.includes("linkedin")
      ) {

        suggestions.push(
          "Add your LinkedIn profile."
        );
      }


      if (
        !text.includes("summary") &&
        !text.includes("objective")
      ) {

        suggestions.push(
          "Consider adding a short professional summary."
        );
      }


      // -------------------------------------------------
      // FINAL RESPONSE
      // -------------------------------------------------

      res.json({

        message:
          "Resume analyzed successfully 🎉",

        fileName:
          req.file.originalname,

        fileSize:
          req.file.size,

        resumeText:
          resumeText,

        score:
          score,

        skills:
          foundSkills,

        missingSkills:
          missingSkills,

        suggestions:
          suggestions,

      });

    } catch (error) {

      console.log(
        "Resume processing error:",
        error
      );

      res.status(500).json({

        message:
          "Resume processing failed",

        error:
          error.message,

      });
    }
  }
);


// =====================================================
// START SERVER
// =====================================================

const PORT =
  process.env.PORT || 5000;
  app.post("/api/coding/submit", async (req, res) => {
  try {
    const { problemId, code } = req.body;

    if (!problemId || !code) {
      return res.status(400).json({
        success: false,
        message: "Problem ID and code are required.",
      });
    }

    const problem = codingProblems[problemId];

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Coding problem not found.",
      });
    }

    if (code.length > 20000) {
      return res.status(400).json({
        success: false,
        message: "Code is too long.",
      });
    }

    const results = [];

    for (const test of problem.tests) {
      const testProgram = `
${code}

try {
  if (typeof ${problem.functionName} !== "function") {
    throw new Error(
      "Function ${problem.functionName} was not found."
    );
  }

  const result = ${problem.functionName}(
    ...${JSON.stringify(test.args)}
  );

  console.log(JSON.stringify(result));
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
`;

      const createResponse = await fetch(
        "https://ce.judge0.com/submissions/?base64_encoded=false&wait=false",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source_code: testProgram,
            language_id: 63,
            cpu_time_limit: 2,
            wall_time_limit: 5,
            memory_limit: 128000,
          }),
        }
      );

      if (!createResponse.ok) {
        const errorText = await createResponse.text();

        return res.status(502).json({
          success: false,
          message: "Code execution service error.",
          details: errorText,
        });
      }

      const submission = await createResponse.json();

      let executionResult = null;

      for (let attempt = 0; attempt < 15; attempt++) {
        await new Promise((resolve) =>
          setTimeout(resolve, 1000)
        );

        const resultResponse = await fetch(
          `https://ce.judge0.com/submissions/${submission.token}?base64_encoded=false`
        );

        executionResult = await resultResponse.json();

        const statusId = executionResult.status?.id;

        if (statusId >= 3) {
          break;
        }
      }

      if (!executionResult) {
        results.push({
          passed: false,
          message: "Execution timed out.",
        });

        continue;
      }

      const statusId = executionResult.status?.id;

      if (statusId !== 3) {
        results.push({
          passed: false,
          message:
            executionResult.status?.description ||
            "Code execution failed.",
          stderr: executionResult.stderr || null,
          compileOutput:
            executionResult.compile_output || null,
        });

        continue;
      }

      const actualOutput = (executionResult.stdout || "").trim();

      const expectedOutput = JSON.stringify(test.expected);

      const passed = actualOutput === expectedOutput;

      results.push({
        passed,
        expected: expectedOutput,
        actual: actualOutput,
        time: executionResult.time || null,
      });
    }

    const passedTests = results.filter(
      (test) => test.passed
    ).length;

    const totalTests = results.length;

    res.json({
      success: true,
      passed: passedTests === totalTests,
      passedTests,
      totalTests,
      results,
    });
  } catch (error) {
    console.error("Coding submission error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong while evaluating the code.",
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {

  console.log(
    `Server running on port ${PORT}`
  );

});
// Coding Practice
const codingProblems = {
  "two-sum": {
    functionName: "twoSum",
    tests: [
      {
        args: [[2, 7, 11, 15], 9],
        expected: [0, 1],
      },
      {
        args: [[3, 2, 4], 6],
        expected: [1, 2],
      },
      {
        args: [[3, 3], 6],
        expected: [0, 1],
      },
    ],
  },

  "reverse-string": {
    functionName: "reverseString",
    tests: [
      {
        args: ["hello"],
        expected: "olleh",
      },
      {
        args: ["interview"],
        expected: "weivretni",
      },
      {
        args: ["abc"],
        expected: "cba",
      },
    ],
  },

  "find-maximum": {
    functionName: "findMaximum",
    tests: [
      {
        args: [[10, 5, 25, 8]],
        expected: 25,
      },
      {
        args: [[-10, -5, -2, -20]],
        expected: -2,
      },
      {
        args: [[100, 20, 50]],
        expected: 100,
      },
    ],
  },

  "palindrome": {
    functionName: "isPalindrome",
    tests: [
      {
        args: ["madam"],
        expected: true,
      },
      {
        args: ["racecar"],
        expected: true,
      },
      {
        args: ["hello"],
        expected: false,
      },
    ],
  },

  "count-vowels": {
    functionName: "countVowels",
    tests: [
      {
        args: ["interview"],
        expected: 4,
      },
      {
        args: ["hello"],
        expected: 2,
      },
      {
        args: ["programming"],
        expected: 3,
      },
    ],
  },
};