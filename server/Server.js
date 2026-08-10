import fs from "fs";
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

dotenv.config();
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

app.listen(PORT, () => {

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